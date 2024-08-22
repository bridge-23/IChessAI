// Inference endpoint generating a token string for a given prompt

#include "inference.h"

#include <string>
#include <unordered_map>
#include <variant>

#include "canister.h"
#include "chats.h"
#include "prompt.h"
#include "http.h"
#include "initialize.h"
#include "run.h"
#include "upload.h"

#include "ic_api.h"

// Replacement for run.c safe_printf
std::string safe_stringify(const char *piece) {
  std::string result;

  // piece might be a raw byte token, and we only want to convert printable chars or whitespace
  // because some of the other bytes can be various control codes, backspace, etc.
  if (piece == NULL) {
    return result;
  }

  if (piece[0] == '\0') {
    return result;
  }

  if (piece[1] == '\0') {
    unsigned char byte_val = piece[0];
    if (!(isprint(byte_val) || isspace(byte_val))) {
      return result; // bad byte, don't include it in the result
    }
  }

  result = piece; // Assign the valid string to the result
  return result;
}

#include <sstream>

std::string generate(IC_API ic_api, Chat *chat, Transformer *transformer,
                     Tokenizer *tokenizer, Sampler *sampler, std::string prompt,
                     int steps, bool *error) {
  *error = false;
  std::string output_next_tokens;

  // encode the (string) prompt into tokens sequence
  int num_prompt_tokens = 0;
  int *prompt_tokens = (int *)malloc((prompt.length() + 3) * sizeof(int));
  if (!prompt_tokens) {
    *error = true;
    return "Failed to allocate memory for prompt_tokens.";
  }
  
  int error_code = 0;
  encode(tokenizer, prompt.c_str(), chat->next, chat->eos, prompt_tokens,
         &num_prompt_tokens, &error_code);
  if (error_code != 0) {
    // Handle encoding errors...
    *error = true;
  }

  chat->bos = 0;
  chat->eos = 0;

  int token = chat->next;
  int pos = chat->pos;
  int prompt_pos = 0;

  unsigned long long max_total_steps =
      chat->total_steps + num_prompt_tokens + steps;
  if (max_total_steps > transformer->config.seq_len)
    max_total_steps = transformer->config.seq_len;

  chat->inference_steps = 0;
  long start = 0;
  int next;

  while (pos < max_total_steps - 1) {
    float *logits = forward(chat, transformer, token, pos);

    chat->inference_steps++;
    chat->total_steps++;

    if (prompt_pos < num_prompt_tokens - 1) {
      next = prompt_tokens[prompt_pos + 1];
      prompt_pos++;
    } else {
      if (steps == 0) {
        break;
      }
      next = sample(sampler, logits);
      
      // Decode and append the new token
      char *piece = decode(tokenizer, token, next);
      output_next_tokens += safe_stringify(piece);
    }
    pos++;

    if (next == 1) {
      break;
    }

    token = next;
  }

  free(prompt_tokens);

  return output_next_tokens;
}
// Inference endpoint for ICGPT, with story ownership based on principal of caller
void inference() { inference_(false); }
void inference_mo() {
  inference_(true);
} // Use this when calling from Motoko, with float64
void inference_(bool from_motoko) {
  IC_API ic_api(CanisterUpdate{std::string(__func__)}, false);
  if (!is_canister_mode_chat_principal()) {
    std::string error_msg =
        "Access Denied: canister_mode is not set to 'principal'.";
    ic_api.to_wire(CandidTypeVariant{
        "Err", CandidTypeVariant{"Other", CandidTypeText{error_msg}}});
    return;
  }
  if (!is_ready_and_authorized(ic_api)) return;

  // Get the Prompt from the wire
  PromptMo wire_prompt_motoko; // Motoko does not support float32, uses float64
  Prompt wire_prompt;
  CandidTypeRecord r_in;
  r_in.append("prompt", CandidTypeText{&wire_prompt.prompt});
  r_in.append("steps", CandidTypeNat64{&wire_prompt.steps});
  if (from_motoko) {
    r_in.append("temperature",
                CandidTypeFloat64{&wire_prompt_motoko.temperature});
    r_in.append("topp", CandidTypeFloat64{&wire_prompt_motoko.topp});
  } else {
    r_in.append("temperature", CandidTypeFloat32{&wire_prompt.temperature});
    r_in.append("topp", CandidTypeFloat32{&wire_prompt.topp});
  }
  r_in.append("rng_seed", CandidTypeNat64{&wire_prompt.rng_seed});
  ic_api.from_wire(r_in);

  if (from_motoko) {
    wire_prompt.temperature =
        static_cast<float>(wire_prompt_motoko.temperature);
    wire_prompt.topp = static_cast<float>(wire_prompt_motoko.topp);
  }
  // print_prompt(wire_prompt);

  CandidTypePrincipal caller = ic_api.get_caller();
  std::string principal = caller.get_text();

  if (p_chats && p_chats->umap.find(principal) == p_chats->umap.end()) {
    if (!build_new_chat(principal, ic_api)) return;
  }
  if (!p_chats || !p_chats_output_history) {
    std::string error_msg =
        "ERROR: null pointers that should not be null in function " +
        std::string(__func__);
    ic_api.to_wire(CandidTypeVariant{
        "Err", CandidTypeVariant{"Other", CandidTypeText{error_msg}}});
    return;
  }

  Chat *chat = &p_chats->umap[principal];
  std::string *output_history = &p_chats_output_history->umap[principal];
  MetadataUser *metadata_user = &p_metadata_users->umap[principal];

  bool error{false};
  std::string output = do_inference(ic_api, wire_prompt, chat, output_history,
                                    metadata_user, &error);

  if (error) {
    ic_api.to_wire(CandidTypeVariant{
        "Err", CandidTypeVariant{"Other", CandidTypeText{output}}});
    return;
  }

  // IC_API::debug_print(output);
  // Send the generated response to the wire
  CandidTypeRecord inference_record;
  inference_record.append("inference", CandidTypeText{output});
  inference_record.append("num_tokens", CandidTypeNat64{chat->inference_steps});
  ic_api.to_wire(CandidTypeVariant{"Ok", CandidTypeRecord{inference_record}});
}

std::string do_inference(IC_API &ic_api, Prompt wire_prompt, Chat *chat,
                         std::string *output_history,
                         MetadataUser *metadata_user, bool *error) {

  // parameter validation/overrides
  if (wire_prompt.rng_seed <= 0)
    wire_prompt.rng_seed = ic_api.time(); // time in ns
  if (wire_prompt.temperature < 0.0) wire_prompt.temperature = 0.0;
  if (wire_prompt.topp < 0.0 || 1.0 < wire_prompt.topp) wire_prompt.topp = 0.9;
  if (wire_prompt.steps < 0) wire_prompt.steps = 0;

  // icpp: if caller provides a prompt , set bos & eos
  // if (wire_prompt.prompt.size() > 0) {
  //   transformer.bos = 1;
  //   transformer.eos = 1;
  // }

  // icpp: We treat 'steps' as additional steps to generate
  //       Do this check inside generate method
  // if (wire_prompt.steps == 0 || wire_prompt.steps > transformer.config.seq_len)
  //   wire_prompt.steps = transformer.config.seq_len; // override to ~max length
  // IC_API::debug_print("--\nAfter parameter validation/overrides.");
  // print_prompt(wire_prompt);

  // build the Sampler
  Sampler sampler;
  build_sampler(&sampler, transformer.config.vocab_size,
                wire_prompt.temperature, wire_prompt.topp,
                wire_prompt.rng_seed);

  // run!
  std::string output;
  // if (mode == "generate") {
  output += generate(ic_api, chat, &transformer, &tokenizer, &sampler,
                     wire_prompt.prompt, wire_prompt.steps, error);
  // } else if (mode =="chat") {
  // chat(&transformer, &tokenizer, &sampler, prompt, system_prompt, steps);
  // } else {
  //   return an error about: "unsupported mode: " + mode)
  // }

  // if (!*error) {
  //   // Update & persist full output using Orthogonal Persistence
  //   *output_history += output;

  //   // Now we have the total_steps, stored with the chat
  //   // And we can update the metadata_user
  //   if (!metadata_user->metadata_chats.empty()) {
  //     MetadataChat &metadata_chat = metadata_user->metadata_chats.back();
  //     metadata_chat.total_steps += chat->total_steps;
  //   }
  //

  // memory and file handles cleanup
  free_sampler(&sampler);

  return output;

}