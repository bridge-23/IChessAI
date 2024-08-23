# On-Chain Chess LLM on ICP Canister

## Project Overview

This project demonstrates the capabilities of a fully on-chain Large Language Model (LLM) implemented on the Internet Computer Protocol (ICP) canister system. The LLM is specifically trained to understand and interact with chess positions, showcasing the potential for complex AI models to run directly on blockchain infrastructure.

## Key Features

- **On-Chain LLM**: A compressed LLM capable of running inference directly within an ICP canister.
- **Chess Understanding**: The model can interpret chess positions and generate legal moves.
- **Efficient Compression**: Advanced techniques to fit a capable LLM within blockchain constraints.
- **C++ Backend**: High-performance backend code for model execution.

## Technical Stack

- **Base Model**: LLaMA2 (compressed variant)
- **Training Data**: Synthesized and cleaned chess data
- **Environment Simulation**: Custom chess environment for model training
- **Backend Language**: C++
- **Deployment**: ICP canister
- **Input Format**: Forsyth–Edwards Notation (FEN) for chess positions

## How It Works

1. **Input**: The system accepts a chess position in FEN format.
2. **Processing**: The on-chain LLM interprets the position and generates possible moves.
3. **Output**: The system returns a list of legal moves for the current position.

## Example Usage

Input:

```
rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w
```

Output:

```
(
  variant {
    Ok = record {
      inference = " g1h3 g1f3 b1c3 b1a3 h2h3 g2g3 f2f3 e2e3 d2d3 c2c3\n<s>\n";
    }
  },
)
```
## Performance Considerations

- The model uses a random number generator (RNG) seed for deterministic behavior.
- Inference time may vary based on the complexity of the chess position.

## Limitations

- The model is optimized for chess and may not perform well on other tasks.
- The size of the model is constrained by ICP canister limitations.

## Future Work

- Expand the model to handle more complex chess scenarios (e.g., endgame positions).
- Optimize inference speed for quicker response times.
- Explore integration with on-chain chess games or tournaments.

## Contributing

We welcome contributions to this project! Please see our contributing guidelines for more information.


## Contact

@mauriciocarpio

### REFERENCE

https://github.com/karpathy/llama2.c

https://github.com/icppWorld/icpp_llm

