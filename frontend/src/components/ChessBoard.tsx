import React, { useState } from 'react';

const pieceIcons: { [key: string]: string } = {
  'K': '♔',
  'Q': '♕',
  'R': '♖',
  'B': '♗',
  'N': '♘',
  'P': '♙',
  'k': '♚',
  'q': '♛',
  'r': '♜',
  'b': '♝',
  'n': '♞',
  'p': '♟',
};

const ChessBoard: React.FC<{ onMove: (move: string, piece: string) => void, currentPlayer: 'white' | 'black' }> = ({ onMove, currentPlayer }) => {
  const initialBoard = [
    ['r', 'n', 'b', 'q', 'k', 'b', 'n', 'r'],
    ['p', 'p', 'p', 'p', 'p', 'p', 'p', 'p'],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
    ['R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R'],
  ];

  const [board, setBoard] = useState(initialBoard);
  const [selectedPiece, setSelectedPiece] = useState<{ row: number, col: number } | null>(null);

  const handleSquareClick = (row: number, col: number) => {
    if (!selectedPiece) {
      // Select the piece if it's the current player's turn to move their pieces
      const piece = board[row][col];
      if (piece && (currentPlayer === 'white' ? piece === piece.toUpperCase() : piece === piece.toLowerCase())) {
        setSelectedPiece({ row, col });
      }
    } else {
      // Move the piece
      const newBoard = [...board.map(row => [...row])];
      const piece = newBoard[selectedPiece.row][selectedPiece.col];
      newBoard[row][col] = piece;
      newBoard[selectedPiece.row][selectedPiece.col] = '';
      setBoard(newBoard);
      setSelectedPiece(null);

      const move = `Moved ${pieceIcons[piece]} from (${selectedPiece.row}, ${selectedPiece.col}) to (${row}, ${col})`;
      onMove(move, piece);
    }
  };

  const renderSquare = (row: number, col: number) => {
    const piece = board[row][col];
    const isSelected = selectedPiece && selectedPiece.row === row && selectedPiece.col === col;
    return (
      <div
        className={`w-16 h-16 flex items-center justify-center ${
          (row + col) % 2 === 0 ? 'bg-gray-300' : 'bg-gray-700'
        } ${isSelected ? 'bg-blue-500' : ''} hover:opacity-75 cursor-pointer`}
        onClick={() => handleSquareClick(row, col)}
      >
        {piece && (
          <span className={`text-4xl ${piece === piece.toUpperCase() ? 'text-white' : 'text-black'}`}>
            {pieceIcons[piece]}
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