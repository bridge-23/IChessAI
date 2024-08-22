import ChessGame from "./chessGame";

// Utility function for readable output of FEN
function printBoard(fen: string): void {
  console.log(
    fen
      .split("/")
      .map((row) => row.replace(/(\d)/g, (_, n) => " ".repeat(n)))
      .join("\n")
  );
}

// Test cases:
function testInitialBoardSetup() {
  const game = new ChessGame();
  const initialFEN = game.getCurrentBoard().toFEN();
  const expectedFEN = "RNBQKBNR/PPPPPPPP/8/8/8/8/pppppppp/rnbqkbnr w - - 0 1";

  console.log("Initial Board Setup:");
  printBoard(initialFEN);
  console.log(initialFEN === expectedFEN ? "Pass" : "Fail");
  console.log();
}

function testPawnMove() {
  const game = new ChessGame();
  console.log("Trying to move pawn from e2 to e4");
  const moveResult = game.makeMove({ row: 6, col: 4 }, { row: 4, col: 4 });
  const currentFEN = game.getCurrentBoard().toFEN();
  const expectedFEN = "rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b - - 0 1";

  console.log("Pawn Move e2 to e4:");
  printBoard(currentFEN);
  console.log("Move result:", moveResult);
  console.log(currentFEN === expectedFEN ? "Pass" : "Fail");
  console.log();
}

function testInvalidKnightMove() {
  const game = new ChessGame();
  const moveResult = game.makeMove({ row: 7, col: 6 }, { row: 5, col: 5 });
  const currentFEN = game.getCurrentBoard().toFEN();
  const expectedFEN = "RNBQKBNR/PPPPPPPP/8/8/8/8/pppppppp/rnbqkbnr w - - 0 1";

  console.log("Knight Move g8 to f6 (Invalid due to turn):");
  printBoard(currentFEN);
  console.log("Move result:", moveResult);
  console.log(currentFEN === expectedFEN ? "Pass" : "Fail");
  console.log();
}

function testValidKnightMove() {
  const game = new ChessGame();
  game.makeMove({ row: 6, col: 4 }, { row: 4, col: 4 }); // First move e2 to e4
  const moveResult = game.makeMove({ row: 7, col: 6 }, { row: 5, col: 5 });
  const currentFEN = game.getCurrentBoard().toFEN();
  const expectedFEN =
    "RNBQKBNR/PPPP1PPP/8/5N2/4P3/8/pppppppp/rnbqkb1r b - - 1 1";

  console.log("Knight Move g1 to f3 (Valid for White):");
  printBoard(currentFEN);
  console.log("Move result:", moveResult);
  console.log(currentFEN === expectedFEN ? "Pass" : "Fail");
  console.log();
}

function testPGNGeneration() {
  const game = new ChessGame();
  game.makeMove({ row: 6, col: 4 }, { row: 4, col: 4 }); // e2 to e4
  game.makeMove({ row: 1, col: 4 }, { row: 3, col: 4 }); // e7 to e5
  const pgn = game.toPGN();

  const expectedPGN = `[Event ""]
[Site ""]
[Date ""]
[Round ""]
[White ""]
[Black ""]
[Result "*"]

Pe2-e4 Pe7-e5`;

  console.log("PGN Generation:");
  console.log(pgn);
  console.log(pgn === expectedPGN ? "Pass" : "Fail");
  console.log();
}

function runTests() {
  testInitialBoardSetup();
  testPawnMove();
  testInvalidKnightMove();
  testValidKnightMove();
  testPGNGeneration();
}

runTests();
