dfx identity use default

#######################################################################
# For Linux & Mac
#######################################################################

echo " "
echo "--------------------------------------------------"
echo "Stopping the local network"
dfx stop

echo " "
echo "--------------------------------------------------"
echo "Starting the local network as a background process"
dfx start --clean --background

#######################################################################
echo "--------------------------------------------------"
echo "Building the wasm with wasi-sdk"
icpp build-wasm --to-compile all
# icpp build-wasm --to-compile mine

#######################################################################
echo " "
echo "--------------------------------------------------"
echo "Deploying the wasm to a canister on the local network"
dfx deploy chess23

#######################################################################
echo " "
echo "--------------------------------------------------"
echo "Setting canister_mode to chat-principal"
dfx canister call chess23 set_canister_mode chat-principal

#######################################################################
echo " "
echo "--------------------------------------------------"
echo "Uploading the model & tokenizer"
python -m scripts.upload --network local --canister chess23 --model models/model.bin --tokenizer models/tok512.bin
