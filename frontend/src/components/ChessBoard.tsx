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

const ChessBoard: React.FC = () => {
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
  const [FEN, setFEN] = useState('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR');
  const [PGN, setPGN] = useState('1. c3');

  const handleSquareClick = (row: number, col: number) => {
    // Implement logic to handle clicks on chess squares
  };

  const renderSquare = (row: number, col: number) => {
    const piece = board[row][col];
    return (
      <div
        className={`w-12 h-12 flex items-center justify-center ${
          (row + col) % 2 === 0 ? 'bg-gray-300' : 'bg-gray-700'
        }`}
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
      <div className="mt-4">
        <label className="block">FEN:</label>
        <input
          type="text"
          value={FEN}
          readOnly
          className="border px-2 py-1 mt-2"
        />
      </div>
      <div className="mt-4">
        <label>PGN:</label>
        <div className="border px-2 py-1 mt-2">
          {PGN}
        </div>
      </div>
    </div>
  );
};

export default ChessBoard;