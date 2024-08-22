import ChessGame from './chessGame';

const game = new ChessGame();

console.log(game.getCurrentBoard().toFEN());
console.log(game.getCurrentTurn());

const moveResult = game.makeMove({ row: 1, col: 4 }, { row: 3, col: 4 });
console.log("Move result:", moveResult);

console.log(game.getCurrentBoard().toFEN());
console.log(game.getCurrentTurn());

console.log("PGN:", game.toPGN());