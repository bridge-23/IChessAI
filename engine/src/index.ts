import ChessGame from './chessGame';

// Create a new chess game
const game = new ChessGame();

// Print the initial board configuration in FEN notation
console.log('Initial board:');
console.log(game.getCurrentBoard().toFEN());
console.log('Current turn:', game.getCurrentTurn());

// Make a move (e2 to e4)
const moveResult = game.makeMove({ row: 6, col: 4 }, { row: 4, col: 4 });
console.log('Move result:', moveResult);

// Print the board configuration after the move in FEN notation
console.log('Board after move:');
console.log(game.getCurrentBoard().toFEN());
console.log('Current turn:', game.getCurrentTurn());

// Print the PGN string representing the game so far
console.log('PGN:');
console.log(game.toPGN());