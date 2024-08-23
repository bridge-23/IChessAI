import React, { useState } from 'react';
import { Chess, Move, Square } from 'chess.js';
import { pieceIcons } from './interface/piece-icons';

const ChessBoard: React.FC<{ onMove: (move: string, piece: string) => void }> = ({ onMove }) => {
  const [chess] = useState(new Chess()); // Initialize the chess game instance
  const [board, setBoard] = useState(chess.board());
  const [selectedSquare, setSelectedSquare] = useState<Square | null>(null); // Explicitly typing as Square | null
  const [isWhiteTurn, setIsWhiteTurn] = useState(true); // Track whose turn it is
  const [lastMove, setLastMove] = useState<{ from: Square; to: Square } | null>(null); // Для хранения последнего хода

  const handleSquareClick = (row: number, col: number) => {
    const square: Square = `${'abcdefgh'[col]}${8 - row}` as Square; // Convert row/col to chess notation and cast to Square

    if (!selectedSquare) {
      // Select the piece if it's the current player's turn
      const piece = board[row][col];
      if (piece && ((isWhiteTurn && piece.color === 'w') || (!isWhiteTurn && piece.color === 'b'))) {
        setSelectedSquare(square);
      }
    } else {
      const validMoves = chess.moves({ square: selectedSquare, verbose: true });
      const validMove = validMoves.find((m: Move) => m.to === square);

      if (validMove) {
        const move = chess.move({ from: selectedSquare, to: square, promotion: 'q' }); // promotion to queen for simplicity

        if (move) {
          setBoard(chess.board());
          onMove(move.san, move.piece); // SAN (Standard Algebraic Notation) of the move
          setLastMove({ from: selectedSquare, to: square }); // Сохраняем последний ход
          setSelectedSquare(null);
          setIsWhiteTurn(!isWhiteTurn);
          console.log('Board state after move:', chess.fen());
        }
      } else {
        // Invalid move or same square re-selection, clear selection
        setSelectedSquare(null);
      }
    }
  };

  const renderSquare = (row: number, col: number) => {
    const square = `${'abcdefgh'[col]}${8 - row}` as Square;
    const piece = board[row][col]?.type;
    const color = board[row][col]?.color;
    const isSelected = selectedSquare === square;
    const isLastMoveFrom = lastMove?.from === square;
    const isLastMoveTo = lastMove?.to === square;

    return (
      <div
        className={`w-16 h-16 flex items-center justify-center transition-all duration-300 ${
          (row + col) % 2 === 0 ? 'bg-gray-300' : 'bg-gray-700'
        } ${isSelected ? 'bg-blue-500' : ''} ${
          isLastMoveFrom || isLastMoveTo ? 'bg-yellow-300' : ''
        } hover:opacity-75 cursor-pointer`}
        onClick={() => handleSquareClick(row, col)}
      >
        {piece && (
          <span className={`text-4xl ${color === 'w' ? 'text-white' : 'text-black'}`}>
            {pieceIcons[piece.toUpperCase()]}
          </span>
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-col items-center">
      <div className="grid grid-cols-8 gap-0">
        {[...Array(8)].map((_, row) => (
          <React.Fragment key={row}>
            {[...Array(8)].map((_, col) => (
              <React.Fragment key={col}>
                {renderSquare(row, col)}
              </React.Fragment>
            ))}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default ChessBoard;
