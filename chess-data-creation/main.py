import chess
import chess.engine
import json
import subprocess
from tqdm import tqdm
import os

def get_stockfish_path():
    try:
        result = subprocess.run(['which', 'stockfish'], capture_output=True, text=True)
        if result.returncode == 0:
            return result.stdout.strip()
        else:
            print("Stockfish not found. Please ensure it's installed and in your PATH.")
            return None
    except Exception as e:
        print(f"An error occurred while trying to locate Stockfish: {e}")
        return None

def get_engine_move(board, engine, limit):
    result = engine.play(board, limit)
    return result.move if result.move else None

def get_next_moves(board, n=10):
    legal_moves = list(board.legal_moves)
    return ' '.join([move.uci() for move in legal_moves[:n]])

def simplified_fen(board):
    split = board.fen().split()
    return f"{split[0]} {split[1]}" 

def play_full_game(engine, time_limit, max_moves=200):
    board = chess.Board()
    game_states = []
    
    for _ in range(max_moves):
        if board.is_game_over():
            break
        
        next_moves = get_next_moves(board)
        game_states.append({
            'fen': f"{simplified_fen(board)} {next_moves}"
        })
        
        move = get_engine_move(board, engine, chess.engine.Limit(time=time_limit))
        if move is None:
            break
        
        board.push(move)
    
    return game_states

def generate_training_data(num_games, engine_path, time_limit):
    engine = chess.engine.SimpleEngine.popen_uci(engine_path)
    all_game_data = []
    
    for i in tqdm(range(num_games), desc="Generating games", unit="game"):
        game_states = play_full_game(engine, time_limit)
        all_game_data.extend(game_states)
        
        # Save every 10 iterations
        if (i + 1) % 10 == 0:
            save_data(all_game_data, f'chess_training_data_simplified_fen_interim_{i+1}.json')
    
    engine.quit()
    return all_game_data

def save_data(data, filename):
    print(f"Saving data to {filename}...")
    with open(filename, 'w') as f:
        json.dump(data, f)
    print(f"Data saved to {filename}")

if __name__ == "__main__":
    engine_path = get_stockfish_path()
    if engine_path is None:
        print("Exiting due to inability to locate Stockfish.")
        exit(1)
    
    print(f"Using Stockfish at: {engine_path}")
    
    num_games = 1  # Adjust this number based on how many full games you want
    time_limit = 0.1 # seconds per move
    
    try:
        training_data = generate_training_data(num_games, engine_path, time_limit)
        
        print(f"Generated a total of {len(training_data)} positions.")
        
        # Save final dataset
        final_filename = 'chess_training_data_simplified_fen_final.json'
        save_data(training_data, final_filename)
        
        print("\nSample data (first 3 positions):")
        print(json.dumps(training_data[:3], indent=2))
    except Exception as e:
        print(f"An error occurred: {e}")
        print("Please ensure you have the latest version of the python-chess library installed.")
        print("You can update it using: pip install --upgrade python-chess")