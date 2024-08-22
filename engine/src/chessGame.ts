import Board from "./board";
import { Position, Color, PieceType } from "./types";

class ChessGame {
  private board: Board;
  private currentTurn: Color;
  private moveHistory: string[];

  constructor() {
    this.board = new Board();
    this.currentTurn = Color.White;
    this.moveHistory = [];
  }

  makeMove(from: Position, to: Position): boolean {
    if (!this.board.isValidMove(from, to)) return false;

    const piece = this.board.getPiece(from);
    if (!piece || piece.color !== this.currentTurn) return false;

    if (this.board.movePiece(from, to)) {
      this.currentTurn =
        this.currentTurn === Color.White ? Color.Black : Color.White;
      this.recordMove(from, to, piece.type);
      return true;
    }

    return false;
  }

  private recordMove(from: Position, to: Position, piece: PieceType): void {
    const fromPos = String.fromCharCode(97 + from.col) + (8 - from.row).toString();
    const toPos = String.fromCharCode(97 + to.col) + (8 - to.row).toString();
    const moveString = `${piece}${fromPos}-${toPos}`;
    this.moveHistory.push(moveString);
  }

  getCurrentBoard(): Board {
    return this.board;
  }

  getCurrentTurn(): Color {
    return this.currentTurn;
  }

  toPGN(): string {
    const headers = [
      '[Event ""]',
      '[Site ""]',
      '[Date ""]',
      '[Round ""]',
      '[White ""]',
      '[Black ""]',
      '[Result "*"]',
    ].join('\n');

    const moves = this.moveHistory.join(' ');
    return `${headers}\n\n${moves}`;
  }
}

export default ChessGame;