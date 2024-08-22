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

const validateKnightMove = (fromRow: number, fromCol: number, toRow: number, toCol: number) => {
  const rowDiff = Math.abs(toRow - fromRow);
  const colDiff = Math.abs(toCol - fromCol);
  return (rowDiff === 2 && colDiff === 1) || (rowDiff === 1 && colDiff === 2);
};

const validateRookMove = (fromRow: number, fromCol: number, toRow: number, toCol: number) => {
  return (fromRow === toRow || fromCol === toCol);
};

const validateBishopMove = (fromRow: number, fromCol: number, toRow: number, toCol: number) => {
  return Math.abs(toRow - fromRow) === Math.abs(toCol - fromCol);
};

const validateQueenMove = (fromRow: number, fromCol: number, toRow: number, toCol: number) => {
  return (
    validateRookMove(fromRow, fromCol, toRow, toCol) ||
    validateBishopMove(fromRow, fromCol, toRow, toCol)
  );
};

const validateKingMove = (fromRow: number, fromCol: number, toRow: number, toCol: number) => {
  const rowDiff = Math.abs(toRow - fromRow);
  const colDiff = Math.abs(toCol - fromCol);
  return (rowDiff <= 1 && colDiff <= 1);
};

const validatePawnMove = (fromRow: number, fromCol: number, toRow: number, toCol: number, piece: string, board: string[][]) => {
  const direction = piece === 'P' ? -1 : 1; // White pawns move up, Black pawns move down
  const startRow = piece === 'P' ? 6 : 1;

  if (fromCol === toCol) {
    if (toRow === fromRow + direction) {
      return true;
    }
    if (toRow === fromRow + 2 * direction && fromRow === startRow) {
      return true;
    }
  }

  // Add condition for capturing diagonally
  if (Math.abs(fromCol - toCol) === 1 && toRow === fromRow + direction) {
    const targetPiece = board[toRow][toCol];
    if (targetPiece && targetPiece !== piece) {
      return true;
    }
  }

  return false;
};

const validateMove = (piece: string, fromRow: number, fromCol: number, toRow: number, toCol: number, board: string[][]) => {
  const targetPiece = board[toRow][toCol];
  const isWhitePiece = piece === piece.toUpperCase();

  // Prevent moving to a square occupied by the same color piece
  if (targetPiece && (isWhitePiece ? targetPiece === targetPiece.toUpperCase() : targetPiece === targetPiece.toLowerCase())) {
    return false;
  }

  switch (piece.toLowerCase()) {
    case 'n': // Knight
      return validateKnightMove(fromRow, fromCol, toRow, toCol);
    case 'r': // Rook
      return validateRookMove(fromRow, fromCol, toRow, toCol);
    case 'b': // Bishop
      return validateBishopMove(fromRow, fromCol, toRow, toCol);
    case 'q': // Queen
      return validateQueenMove(fromRow, fromCol, toRow, toCol);
    case 'k': // King
      return validateKingMove(fromRow, fromCol, toRow, toCol);
    case 'p': // Pawn
      return validatePawnMove(fromRow, fromCol, toRow, toCol, piece, board);
    default:
      return false;
  }
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
  const [lastMove, setLastMove] = useState<{ fromRow: number, fromCol: number, toRow: number, toCol: number } | null>(null);

  const handleSquareClick = (row: number, col: number) => {
    if (!selectedPiece) {
      const piece = board[row][col];
      if (piece && (currentPlayer === 'white' ? piece === piece.toUpperCase() : piece === piece.toLowerCase())) {
        setSelectedPiece({ row, col });
      }
    } else {
      const piece = board[selectedPiece.row][selectedPiece.col];

      if (validateMove(piece, selectedPiece.row, selectedPiece.col, row, col, board)) {
        const newBoard = [...board.map(row => [...row])];
        newBoard[row][col] = piece;
        newBoard[selectedPiece.row][selectedPiece.col] = '';
        setBoard(newBoard);
        setLastMove({ fromRow: selectedPiece.row, fromCol: selectedPiece.col, toRow: row, toCol: col });
        setSelectedPiece(null);

        const move = `Moved ${pieceIcons[piece]} from (${selectedPiece.row}, ${selectedPiece.col}) to (${row}, ${col})`;
        onMove(move, piece);
      } else {
        setSelectedPiece(null); // Clear the selection if the move is invalid
      }
    }
  };

  const renderSquare = (row: number, col: number) => {
    const piece = board[row][col];
    const isSelected = selectedPiece && selectedPiece.row === row && selectedPiece.col === col;
    const isLastMove = lastMove && ((lastMove.fromRow === row && lastMove.fromCol === col) || (lastMove.toRow === row && lastMove.toCol === col));
    return (
      <div
        className={`w-16 h-16 flex items-center justify-center ${(row + col) % 2 === 0 ? 'bg-gray-300' : 'bg-gray-700'
          } ${isSelected ? 'bg-blue-500' : ''} ${isLastMove ? 'bg-yellow-500' : ''} hover:opacity-75 cursor-pointer`}
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