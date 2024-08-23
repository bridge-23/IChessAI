import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export type ApiError = { 'InvalidId' : null } |
  { 'ZeroAddress' : null } |
  { 'StatusCode' : number } |
  { 'Other' : string };
export interface CanisterModeRecord { 'canister_mode' : string }
export type CanisterModeRecordResult = { 'Ok' : CanisterModeRecord } |
  { 'Err' : ApiError };
export interface Config {
  'dim' : bigint,
  'n_kv_heads' : bigint,
  'vocab_size' : bigint,
  'hidden_dim' : bigint,
  'n_layers' : bigint,
  'seq_len' : bigint,
  'n_heads' : bigint,
}
export type HeaderField = [string, string];
export interface HttpRequest {
  'url' : string,
  'method' : string,
  'body' : Uint8Array | number[],
  'headers' : Array<HeaderField>,
  'certificate_version' : [] | [number],
}
export interface HttpResponse {
  'body' : Uint8Array | number[],
  'headers' : Array<HeaderField>,
  'upgrade' : [] | [boolean],
  'status_code' : number,
}
export interface InferenceRecord { 'inference' : string }
export type InferenceRecordResult = { 'Ok' : InferenceRecord } |
  { 'Err' : ApiError };
export interface NFT { 'token_id' : string }
export interface NFTCollectionRecord {
  'nft_supply_cap' : bigint,
  'nft_name' : string,
  'nft_symbol' : string,
  'nft_description' : string,
  'nft_total_supply' : bigint,
}
export type NFTCollectionRecordResult = { 'Ok' : NFTCollectionRecord } |
  { 'Err' : ApiError };
export interface NFTWhitelistRecord { 'id' : Principal, 'description' : string }
export interface Prompt { 'prompt' : string }
export interface PromptMo {
  'temperature' : number,
  'topp' : number,
  'steps' : bigint,
  'rng_seed' : bigint,
  'prompt' : string,
}
export interface StatusCodeRecord { 'status_code' : number }
export type StatusCodeRecordResult = { 'Ok' : StatusCodeRecord } |
  { 'Err' : ApiError };
export interface StoryRecord { 'story' : string }
export type StoryRecordResult = { 'Ok' : StoryRecord } |
  { 'Err' : ApiError };
export interface UserMetadataRecord {
  'chats_total_steps' : BigUint64Array | bigint[],
  'chats_start_time' : BigUint64Array | bigint[],
}
export type UserMetadataRecordResult = { 'Ok' : UserMetadataRecord } |
  { 'Err' : ApiError };
export interface UsersRecord {
  'user_count' : bigint,
  'user_ids' : Array<string>,
}
export type UsersRecordResult = { 'Ok' : UsersRecord } |
  { 'Err' : ApiError };
export interface _SERVICE {
  'canister_init' : ActorMethod<[], undefined>,
  'get_model_config' : ActorMethod<[], Config>,
  'get_user_metadata' : ActorMethod<[string], UserMetadataRecordResult>,
  'get_users' : ActorMethod<[], UsersRecordResult>,
  'health' : ActorMethod<[], StatusCodeRecordResult>,
  'http_request' : ActorMethod<[HttpRequest], HttpResponse>,
  'inference_chess' : ActorMethod<[Prompt], InferenceRecordResult>,
  'initialize' : ActorMethod<[], StatusCodeRecordResult>,
  'new_chat' : ActorMethod<[], StatusCodeRecordResult>,
  'nft_ami_whitelisted' : ActorMethod<[], StatusCodeRecordResult>,
  'nft_get_story' : ActorMethod<[NFT], StoryRecordResult>,
  'nft_init' : ActorMethod<[NFTCollectionRecord], StatusCodeRecordResult>,
  'nft_metadata' : ActorMethod<[], NFTCollectionRecordResult>,
  'nft_mint' : ActorMethod<[NFT], StatusCodeRecordResult>,
  'nft_story_continue' : ActorMethod<[NFT, Prompt], InferenceRecordResult>,
  'nft_story_continue_mo' : ActorMethod<[NFT, PromptMo], InferenceRecordResult>,
  'nft_story_start' : ActorMethod<[NFT, Prompt], InferenceRecordResult>,
  'nft_story_start_mo' : ActorMethod<[NFT, PromptMo], InferenceRecordResult>,
  'nft_whitelist' : ActorMethod<[NFTWhitelistRecord], StatusCodeRecordResult>,
  'ready' : ActorMethod<[], StatusCodeRecordResult>,
  'reset_model' : ActorMethod<[], StatusCodeRecordResult>,
  'reset_tokenizer' : ActorMethod<[], StatusCodeRecordResult>,
  'set_canister_mode' : ActorMethod<[string], StatusCodeRecordResult>,
  'upload_model_bytes_chunk' : ActorMethod<
    [Uint8Array | number[]],
    StatusCodeRecordResult
  >,
  'upload_tokenizer_bytes_chunk' : ActorMethod<
    [Uint8Array | number[]],
    StatusCodeRecordResult
  >,
  'whoami' : ActorMethod<[], string>,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
