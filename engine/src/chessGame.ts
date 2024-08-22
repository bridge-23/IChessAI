//src/chessGame.ts
import Board from "./board";
import { Position, Color, PieceType } from "./types";

interface MoveDetails {
  from: string;
  dest: string;
  promotion?: "B" | "N" | "R" | "Q";
}

class ChessGame {
  private board: Board;
  private currentTurn: Color;
  private moveHistory: string[];
  private gameWinner: "white" | "black" | "draw" | undefined = undefined;
  private drawReason: string | undefined = undefined;

  constructor() {
    this.board = new Board();
    this.currentTurn = Color.White;
    this.moveHistory = [];
  }

  makeMove(from: Position, to: Position): boolean {
    if (!this.board.isValidMove(from, to)) {
      console.log(
        `Move from ${JSON.stringify(from)} to ${JSON.stringify(to)} is invalid`
      );
      return false;
    }

    const piece = this.board.getPiece(from);
    if (!piece || piece.color !== this.currentTurn) {
      console.log(
        `Move from ${JSON.stringify(from)} to ${JSON.stringify(
          to
        )} is invalid for current turn ${this.currentTurn}`
      );
      return false;
    }

    if (this.board.movePiece(from, to)) {
      this.currentTurn =
        this.currentTurn === Color.White ? Color.Black : Color.White;
      this.recordMove(from, to, piece.type);
      console.log(
        `Move from ${JSON.stringify(from)} to ${JSON.stringify(
          to
        )} was successful`
      );
      return true;
    }

    console.log(
      `Move from ${JSON.stringify(from)} to ${JSON.stringify(to)} failed`
    );
    return false;
  }

  private recordMove(from: Position, to: Position, piece: PieceType): void {
    const fromPos =
      String.fromCharCode(97 + from.col) + (8 - from.row).toString();
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
    ].join("\n");

    const moves = this.moveHistory.join(" ");
    return `${headers}\n\n${moves}`;
  }

  isGameOver(): boolean {
    // Assuming the board has a method to determine game over state
    return this.gameWinner !== undefined || this.board.isStalemate() || this.board.isCheckmate();
  }

  getStatus(): {
    state: "active" | "checkmate" | "resigned" | "draw-other" | "draw-stalemate" | "draw-repetition" | "draw-fifty-moves" | "draw-no-material";
    turn: "white" | "black";
    winner?: "white" | "black" | "draw";
    reason?: string;
  } {
    let state: "active" | "checkmate" | "resigned" | "draw-other" | "draw-stalemate" | "draw-repetition" | "draw-fifty-moves" | "draw-no-material" = "active";
    if (this.isGameOver()) {
      if (this.board.isCheckmate()) {
        state = "checkmate";
        this.gameWinner = this.currentTurn === Color.White ? "black" : "white";
      } else if (this.board.isStalemate()) {
        state = "draw-stalemate";
        this.gameWinner = "draw";
      } else if (this.board.isFiftyMoveDraw()) {
        state = "draw-fifty-moves";
        this.gameWinner = "draw";
      } else if (this.board.isInsufficientMaterial()) {
        state = "draw-no-material";
        this.gameWinner = "draw";
      }
    }
  
    return {
      state,
      turn: this.currentTurn === Color.White ? "white" : "black",
      winner: this.gameWinner,
      reason: this.drawReason,
    };
  }

  allMoves(coord?: string): MoveDetails[] {
    const moves = this.board.listAllMoves(this.currentTurn, coord);
    return moves.map((move: any) => {
      const from = String.fromCharCode(97 + move.from.col) + (8 - move.from.row).toString();
      const dest = String.fromCharCode(97 + move.to.col) + (8 - move.to.row).toString();

      return move.promote ? { from, dest, promotion: move.promote as "B" | "N" | "R" | "Q" } : { from, dest };
    });
  }

  // Additional methods to handle resignations and draws
  resignGame(player: "white" | "black") {
    if (this.isGameOver()) {
      console.warn("Game is already over.");
      return;
    }
    this.gameWinner = player === "white" ? "black" : "white";
    this.drawReason = "resignation";
  }

  drawGame(reason?: string) {
    if (this.isGameOver()) {
      console.warn("Game is already over.");
      return;
    }
    this.gameWinner = "draw";
    this.drawReason = reason || "agreed draw";
  }
}

export default ChessGame;