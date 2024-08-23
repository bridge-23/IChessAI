import json
import random

def load_chess_data(file_path):
    with open(file_path, 'r') as f:
        return json.load(f)

def format_for_llm_training(chess_data):
    formatted_data = []
    for position in chess_data:
        fen = position['fen']
        best_move = position['best_move']
        
        # Format: FEN as input, best move as output
        formatted_data.append(f"{fen}\t{best_move}")

    return formatted_data

def save_formatted_data(formatted_data, output_file):
    with open(output_file, 'w') as f:
        for item in formatted_data:
            f.write(item + "\n")

if __name__ == "__main__":
    input_file = 'chess_training_data_20k.json'
    output_file = 'chess_llm_training_data_simple.txt'

    print("Loading chess data...")
    chess_data = load_chess_data(input_file)

    print("Formatting data for LLM training...")
    formatted_data = format_for_llm_training(chess_data)

    print("Saving formatted data...")
    save_formatted_data(formatted_data, output_file)

    print(f"Formatted data saved to {output_file}")
    print(f"Total training examples: {len(formatted_data)}")

    # Print a few examples
    print("\nSample formatted data:")
    for i in range(5):
        print(f"Example {i+1}:")
        print(formatted_data[random.randint(0, len(formatted_data)-1)])
        print("-" * 50)