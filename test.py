import chess
import time
import re
import subprocess
import random

def simulate_canister_call(board, steps=200, temperature=1.0, topp=0.9):
    fen_parts = board.fen().split()
    input_format = f"{fen_parts[0]} {fen_parts[1]}"
    rng_seed = random.randint(0, 1000000)

    command = f"""
    dfx canister call chess23 inference_chess '(record {{
        prompt = "{input_format}" : text;
    }})'
    """
    print(f"Executing command with RNG seed: {rng_seed}")
    print(f"Input format: {input_format}")

    try:
        result = subprocess.run(command, shell=True, check=True, capture_output=True, text=True)
        output = result.stdout.strip()
        print("Raw output:", output)
        
        # Extract the inference part from the output
        match = re.search(r'inference = "(.*?)"', output, re.DOTALL)
        
        if match:
            inference = match.group(1)
            # Extract all potential moves from the inference
            move_matches = re.findall(r'([a-h][1-8][a-h][1-8])', inference)
            return move_matches
        else:
            print(f"No inference found in output: {output}")
        
        return []

    except subprocess.CalledProcessError as e:
        print(f"Error executing dfx command: {e}")
        return []
    except Exception as e:
        print(f"Unexpected error: {e}")
        return []

def display_board(board):
    print("\n" + str(board) + "\n")
    fen_parts = board.fen().split()
    print("Input format:", f"{fen_parts[0]} {fen_parts[1]}")
    print("Full FEN:", board.fen())
    print("Fullmove number:", board.fullmove_number)
    print("Halfmove clock:", board.halfmove_clock)
    print("Legal moves:", [move.uci() for move in board.legal_moves])

def get_ai_move(board, max_attempts=20):
    for attempt in range(max_attempts):
        suggested_moves = simulate_canister_call(board)
        print(f"Suggested moves: {suggested_moves}")
        
        for move_uci in suggested_moves:
            try:
                move = chess.Move.from_uci(move_uci)
                if move in board.legal_moves:
                    return move
            except ValueError:
                print(f"Invalid move format: {move_uci}")
        
        print(f"Attempt {attempt + 1}: No legal moves found in suggestions. Trying again.")
    
    print(f"AI failed to provide a legal move after {max_attempts} attempts. Choosing a random legal move.")
    return random.choice(list(board.legal_moves))

def main():
    board = chess.Board()
    
    while not board.is_game_over():
        display_board(board)
        
        player = "White" if board.turn == chess.WHITE else "Black"
        
        move = get_ai_move(board)
        print(f"{player}'s move (AI): {move.uci()}")

        board.push(move)
        time.sleep(1)  # Pause for 2 seconds between moves
    
    print("Game over.")
    print("Final position:")
    display_board(board)
    print("Result:", board.result())
    print("Termination reason:", board.outcome().termination if board.outcome() else "Unknown")

if __name__ == "__main__":
    main()