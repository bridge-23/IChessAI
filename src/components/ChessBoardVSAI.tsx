import React, { useState, useEffect } from 'react';
import { pieceIcons } from './interface/piece-icons';
import { Chess, Move, Square } from 'chess.js';

const ChessBoardVSAI: React.FC<{ onMove: (move: string, piece: string) => void }> = ({ onMove }) => {
    const [chess] = useState(new Chess()); // Initialize the chess game instance
    const [board, setBoard] = useState(chess.board());
    const [selectedSquare, setSelectedSquare] = useState<Square | null>(null); // Explicitly typing as Square | null
    const [isWhiteTurn, setIsWhiteTurn] = useState(true); // Track whose turn it is
    const [moveAttempt, setMoveAttempt] = useState(0); // Track number of AI move attempts

    useEffect(() => {
        if (!isWhiteTurn) {
            // If it's Black's turn, make an AI move
            makeAiMove();
        }
    }, [isWhiteTurn]);

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

    const makeAiMove = () => {


        // Simulating server response
        let inference = '';

        if (moveAttempt === 0) {
            inference = 'h8g8 f8e7 f8d6 f8c5 f8b4 f8a3 e8e7 d8e7 b8c6 b8a6';
            console.log('AI attempt 1: Impossible moves.');
        } else {
            inference = 'h8g8 f8e7 e7e5';
            console.log('AI attempt 2: Making a valid move with a pawn.');
        }

        setMoveAttempt(moveAttempt + 1);

        const moves = inference.split(' ');
        let moveMade = false;

        for (const move of moves) {
            const from: Square = move.slice(0, 2) as Square;
            const to: Square = move.slice(2, 4) as Square;

            // Check the validity of the move before making it
            const validMove = chess.moves({ square: from, verbose: true }).find((m: Move) => m.to === to);
            if (validMove) {
                const aiMove = chess.move({ from, to, promotion: 'q' });

                if (aiMove) {
                    setBoard(chess.board());
                    onMove(aiMove.san, aiMove.piece);
                    setIsWhiteTurn(!isWhiteTurn);
                    moveMade = true;
                    break;
                }
            }
        }

        if (!moveMade) {
            // If none of the suggested moves are valid, try again
            makeAiMove();
        }
    };

    const renderSquare = (row: number, col: number) => {
        const piece = board[row][col]?.type;
        const color = board[row][col]?.color;
        const isSelected = selectedSquare === `${'abcdefgh'[col]}${8 - row}`;

        return (
            <div
                className={`w-16 h-16 flex items-center justify-center ${(row + col) % 2 === 0 ? 'bg-gray-300' : 'bg-gray-700'
                    } ${isSelected ? 'bg-blue-500' : ''} hover:opacity-75 cursor-pointer`}
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

export default ChessBoardVSAI;
