// src/types.ts
export enum PieceType {
  Pawn = "P",
  Rook = "R",
  Knight = "N",
  Bishop = "B",
  Queen = "Q",
  King = "K",
}

export enum Color {
  White = "w",
  Black = "b",
}

export interface Piece {
  type: PieceType;
  color: Color;
}

export interface Position {
  row: number;
  col: number;
}
