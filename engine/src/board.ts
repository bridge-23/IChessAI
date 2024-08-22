// src/board.ts
import { Piece, PieceType, Color, Position } from "./types";

class Board {
  private squares: (Piece | null)[][];
  private halfmoveClock: number;
  private fullmoveNumber: number;
  public current: {
    status: number;
    turn: Color;
  };

  constructor() {
    this.squares = Array(8)
      .fill(null)
      .map(() => Array(8).fill(null));
    this.halfmoveClock = 0;
    this.fullmoveNumber = 1;
    this.current = {
      status: 0, // Active game status
      turn: Color.White,
    };
    this.setupInitialPosition();
  }

  private setupInitialPosition() {
    for (let i = 0; i < 8; i++) {
      this.squares[1][i] = { type: PieceType.Pawn, color: Color.White };
      this.squares[6][i] = { type: PieceType.Pawn, color: Color.Black };
    }

    const setupRow = (row: number, color: Color) => {
      const pieces = [
        PieceType.Rook,
        PieceType.Knight,
        PieceType.Bishop,
        PieceType.Queen,
        PieceType.King,
        PieceType.Bishop,
        PieceType.Knight,
        PieceType.Rook,
      ];
      for (let i = 0; i < 8; i++) {
        this.squares[row][i] = { type: pieces[i], color: color };
      }
    };

    setupRow(0, Color.White);
    setupRow(7, Color.Black);
  }

  getPiece(pos: Position): Piece | null {
    return this.squares[pos.row][pos.col];
  }

  movePiece(from: Position, to: Position): boolean {
    const piece = this.getPiece(from);
    if (!piece) return false;

    this.squares[to.row][to.col] = piece;
    this.squares[from.row][from.col] = null;

    // Update halfmove clock and fullmove number
    this.halfmoveClock++;
    if (piece.type === PieceType.Pawn || this.getPiece(to) !== null) {
      this.halfmoveClock = 0;
    }
    if (piece.color === Color.Black) {
      this.fullmoveNumber++;
    }

    return true;
  }

  // Basic move validation with specific rules
  isValidMove(from: Position, to: Position): boolean {
    const piece = this.getPiece(from);
    if (!piece) return false;

    // Check if the destination is within the board
    if (to.row < 0 || to.row > 7 || to.col < 0 || to.col > 7) return false;

    // Check if the destination is not occupied by a piece of the same color
    const destPiece = this.getPiece(to);
    if (destPiece && destPiece.color === piece.color) return false;

    // Validate moves for each piece type
    switch (piece.type) {
      case PieceType.Pawn:
        return this.isValidPawnMove(from, to, piece.color);
      case PieceType.Rook:
        return this.isValidRookMove(from, to);
      case PieceType.Knight:
        return this.isValidKnightMove(from, to);
      case PieceType.Bishop:
        return this.isValidBishopMove(from, to);
      case PieceType.Queen:
        return this.isValidQueenMove(from, to);
      case PieceType.King:
        return this.isValidKingMove(from, to);
      default:
        return false;
    }
  }

  isValidPawnMove(from: Position, to: Position, color: Color): boolean {
    const dir = color === Color.White ? -1 : 1;
    const startRow = color === Color.White ? 6 : 1;

    // Move forward
    if (from.col === to.col) {
      // Move one step forward
      if (to.row === from.row + dir && !this.getPiece(to)) {
        return true;
      }
      // Move two steps forward from starting position
      if (
        from.row === startRow &&
        to.row === from.row + 2 * dir &&
        !this.getPiece(to) &&
        !this.getPiece({ row: from.row + dir, col: from.col })
      ) {
        return true;
      }
    }
    // Capture diagonally
    else if (
      Math.abs(to.col - from.col) === 1 &&
      to.row === from.row + dir &&
      this.getPiece(to) &&
      this.getPiece(to)!.color !== color
    ) {
      return true;
    }

    return false;
  }

  isValidRookMove(from: Position, to: Position): boolean {
    if (from.row !== to.row && from.col !== to.col) return false;

    const stepRow = from.row === to.row ? 0 : to.row > from.row ? 1 : -1;
    const stepCol = from.col === to.col ? 0 : to.col > from.col ? 1 : -1;

    let currentRow = from.row + stepRow;
    let currentCol = from.col + stepCol;

    while (currentRow !== to.row || currentCol !== to.col) {
      if (this.getPiece({ row: currentRow, col: currentCol })) return false;
      currentRow += stepRow;
      currentCol += stepCol;
    }

    return true;
  }

  isValidKnightMove(from: Position, to: Position): boolean {
    const rowDiff = Math.abs(from.row - to.row);
    const colDiff = Math.abs(from.col - to.col);

    return (rowDiff === 2 && colDiff === 1) || (rowDiff === 1 && colDiff === 2);
  }

  isValidBishopMove(from: Position, to: Position): boolean {
    if (Math.abs(from.row - to.row) !== Math.abs(from.col - to.col))
      return false;

    const stepRow = to.row > from.row ? 1 : -1;
    const stepCol = to.col > from.col ? 1 : -1;

    let currentRow = from.row + stepRow;
    let currentCol = from.col + stepCol;

    while (currentRow !== to.row || currentCol !== to.col) {
      if (this.getPiece({ row: currentRow, col: currentCol })) return false;
      currentRow += stepRow;
      currentCol += stepCol;
    }

    return true;
  }

  isValidQueenMove(from: Position, to: Position): boolean {
    return this.isValidRookMove(from, to) || this.isValidBishopMove(from, to);
  }

  isValidKingMove(from: Position, to: Position): boolean {
    const rowDiff = Math.abs(from.row - to.row);
    const colDiff = Math.abs(from.col - to.col);

    return rowDiff <= 1 && colDiff <= 1;
  }

  isCheckmate(): boolean {
    // Implement logic to check for checkmate
    // Placeholder return
    return false;
  }

  isStalemate(): boolean {
    // Implement logic to check for stalemate
    // Placeholder return
    return false;
  }

  isFiftyMoveDraw(): boolean {
    return this.halfmoveClock >= 50;
  }

  isInsufficientMaterial(): boolean {
    // Implement logic to check for insufficient material
    // Placeholder return
    return false;
  }

  listAllMoves(color: Color, coord?: string) {
    // Implement logic to list all possible moves for a given color
    // Placeholder return
    return [];
  }

  toFEN(): string {
    const ranks = this.squares.map((rank) => {
      let empty = 0;
      return (
        rank
          .map((piece) => {
            if (piece === null) {
              empty++;
              return "";
            } else {
              const symbol = piece.type.toLowerCase();
              const result =
                piece.color === Color.White ? symbol.toUpperCase() : symbol;
              const emptyStr = empty > 0 ? empty.toString() : "";
              empty = 0;
              return `${emptyStr}${result}`;
            }
          })
          .join("") + (empty > 0 ? empty.toString() : "")
      );
    });

    // Active color
    const activeColor = this.current.turn === Color.White ? "w" : "b";

    // Castling availability and en passant target are placeholders for now
    const castling = "-";
    const enPassant = "-";

    return `${ranks.join("/")}${activeColor} ${castling} ${enPassant} ${this.halfmoveClock} ${this.fullmoveNumber}`;
  }
}

export default Board;