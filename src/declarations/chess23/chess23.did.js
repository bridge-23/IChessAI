export const idlFactory = ({ IDL }) => {
  const Config = IDL.Record({
    'dim' : IDL.Int,
    'n_kv_heads' : IDL.Int,
    'vocab_size' : IDL.Int,
    'hidden_dim' : IDL.Int,
    'n_layers' : IDL.Int,
    'seq_len' : IDL.Int,
    'n_heads' : IDL.Int,
  });
  const UserMetadataRecord = IDL.Record({
    'chats_total_steps' : IDL.Vec(IDL.Nat64),
    'chats_start_time' : IDL.Vec(IDL.Nat64),
  });
  const ApiError = IDL.Variant({
    'InvalidId' : IDL.Null,
    'ZeroAddress' : IDL.Null,
    'StatusCode' : IDL.Nat16,
    'Other' : IDL.Text,
  });
  const UserMetadataRecordResult = IDL.Variant({
    'Ok' : UserMetadataRecord,
    'Err' : ApiError,
  });
  const UsersRecord = IDL.Record({
    'user_count' : IDL.Nat64,
    'user_ids' : IDL.Vec(IDL.Text),
  });
  const UsersRecordResult = IDL.Variant({
    'Ok' : UsersRecord,
    'Err' : ApiError,
  });
  const StatusCodeRecord = IDL.Record({ 'status_code' : IDL.Nat16 });
  const StatusCodeRecordResult = IDL.Variant({
    'Ok' : StatusCodeRecord,
    'Err' : ApiError,
  });
  const HeaderField = IDL.Tuple(IDL.Text, IDL.Text);
  const HttpRequest = IDL.Record({
    'url' : IDL.Text,
    'method' : IDL.Text,
    'body' : IDL.Vec(IDL.Nat8),
    'headers' : IDL.Vec(HeaderField),
    'certificate_version' : IDL.Opt(IDL.Nat16),
  });
  const HttpResponse = IDL.Record({
    'body' : IDL.Vec(IDL.Nat8),
    'headers' : IDL.Vec(HeaderField),
    'upgrade' : IDL.Opt(IDL.Bool),
    'status_code' : IDL.Nat16,
  });
  const Prompt = IDL.Record({ 'prompt' : IDL.Text });
  const InferenceRecord = IDL.Record({ 'inference' : IDL.Text });
  const InferenceRecordResult = IDL.Variant({
    'Ok' : InferenceRecord,
    'Err' : ApiError,
  });
  const NFT = IDL.Record({ 'token_id' : IDL.Text });
  const StoryRecord = IDL.Record({ 'story' : IDL.Text });
  const StoryRecordResult = IDL.Variant({
    'Ok' : StoryRecord,
    'Err' : ApiError,
  });
  const NFTCollectionRecord = IDL.Record({
    'nft_supply_cap' : IDL.Nat64,
    'nft_name' : IDL.Text,
    'nft_symbol' : IDL.Text,
    'nft_description' : IDL.Text,
    'nft_total_supply' : IDL.Nat64,
  });
  const NFTCollectionRecordResult = IDL.Variant({
    'Ok' : NFTCollectionRecord,
    'Err' : ApiError,
  });
  const PromptMo = IDL.Record({
    'temperature' : IDL.Float64,
    'topp' : IDL.Float64,
    'steps' : IDL.Nat64,
    'rng_seed' : IDL.Nat64,
    'prompt' : IDL.Text,
  });
  const NFTWhitelistRecord = IDL.Record({
    'id' : IDL.Principal,
    'description' : IDL.Text,
  });
  return IDL.Service({
    'canister_init' : IDL.Func([], [], []),
    'get_model_config' : IDL.Func([], [Config], ['query']),
    'get_user_metadata' : IDL.Func(
        [IDL.Text],
        [UserMetadataRecordResult],
        ['query'],
      ),
    'get_users' : IDL.Func([], [UsersRecordResult], ['query']),
    'health' : IDL.Func([], [StatusCodeRecordResult], ['query']),
    'http_request' : IDL.Func([HttpRequest], [HttpResponse], ['query']),
    'inference_chess' : IDL.Func([Prompt], [InferenceRecordResult], []),
    'initialize' : IDL.Func([], [StatusCodeRecordResult], []),
    'new_chat' : IDL.Func([], [StatusCodeRecordResult], []),
    'nft_ami_whitelisted' : IDL.Func([], [StatusCodeRecordResult], []),
    'nft_get_story' : IDL.Func([NFT], [StoryRecordResult], ['query']),
    'nft_init' : IDL.Func([NFTCollectionRecord], [StatusCodeRecordResult], []),
    'nft_metadata' : IDL.Func([], [NFTCollectionRecordResult], ['query']),
    'nft_mint' : IDL.Func([NFT], [StatusCodeRecordResult], []),
    'nft_story_continue' : IDL.Func([NFT, Prompt], [InferenceRecordResult], []),
    'nft_story_continue_mo' : IDL.Func(
        [NFT, PromptMo],
        [InferenceRecordResult],
        [],
      ),
    'nft_story_start' : IDL.Func([NFT, Prompt], [InferenceRecordResult], []),
    'nft_story_start_mo' : IDL.Func(
        [NFT, PromptMo],
        [InferenceRecordResult],
        [],
      ),
    'nft_whitelist' : IDL.Func(
        [NFTWhitelistRecord],
        [StatusCodeRecordResult],
        [],
      ),
    'ready' : IDL.Func([], [StatusCodeRecordResult], ['query']),
    'reset_model' : IDL.Func([], [StatusCodeRecordResult], []),
    'reset_tokenizer' : IDL.Func([], [StatusCodeRecordResult], []),
    'set_canister_mode' : IDL.Func([IDL.Text], [StatusCodeRecordResult], []),
    'upload_model_bytes_chunk' : IDL.Func(
        [IDL.Vec(IDL.Nat8)],
        [StatusCodeRecordResult],
        [],
      ),
    'upload_tokenizer_bytes_chunk' : IDL.Func(
        [IDL.Vec(IDL.Nat8)],
        [StatusCodeRecordResult],
        [],
      ),
    'whoami' : IDL.Func([], [IDL.Text], ['query']),
  });
};
export const init = ({ IDL }) => { return []; };
