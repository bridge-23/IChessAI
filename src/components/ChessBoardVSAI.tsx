import React, { useState, useEffect } from 'react';
import { pieceIcons } from './interface/piece-icons';
import { Chess, Move, Square } from 'chess.js';
import { chess23 } from "declarations/chess23";
import { ApiError, InferenceRecord } from "declarations/chess23/chess23.did";

const ChessBoardVSAI: React.FC<{ onMove: (move: string, piece: string) => void }> = ({ onMove }) => {
    const [chess] = useState(new Chess()); // Initialize the chess game instance
    const [board, setBoard] = useState(chess.board());
    const [selectedSquare, setSelectedSquare] = useState<Square | null>(null); // Explicitly typing as Square | null
    const [isWhiteTurn, setIsWhiteTurn] = useState(true); // Track whose turn it is
    const [loading, setLoading] = useState(false); // Для отображения загрузки при ходе AI
    const [lastMove, setLastMove] = useState<{ from: Square; to: Square } | null>(null); // Для хранения последнего хода

    useEffect(() => {
        if (!isWhiteTurn) {
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
                    setLastMove({ from: selectedSquare, to: square });
                    setSelectedSquare(null);
                    setIsWhiteTurn(!isWhiteTurn);
                    console.log('Board state after move:', chess.fen());
                }
            } else {
                setSelectedSquare(null);
            }
        }
    };

    const callInference = async (fen: string) => {
        const data = { prompt: fen };  // Структура запроса
        const response = await chess23.inference_chess(data);
        return response;
    };

    const makeAiMove = async () => {
        setLoading(true); // Показать индикатор загрузки
        const fullFen = chess.fen();
        const fen = fullFen.split(' ').slice(0, 2).join(' ');

        const inferenceResult = await callInference(fen);

        if ("Ok" in inferenceResult) {
            const inference = inferenceResult.Ok.inference.trim();
            const moves = inference.split(' ');
            let moveMade = false;

            for (const move of moves) {
                const from: Square = move.slice(0, 2) as Square;
                const to: Square = move.slice(2, 4) as Square;

                const validMove = chess.moves({ square: from, verbose: true }).find((m: Move) => m.to === to);
                if (validMove) {
                    const aiMove = chess.move({ from, to, promotion: 'q' });

                    if (aiMove) {
                        setBoard(chess.board());
                        onMove(aiMove.san, aiMove.piece);
                        setLastMove({ from, to });
                        setIsWhiteTurn(!isWhiteTurn);
                        moveMade = true;
                        break;
                    }
                }
            }

            if (!moveMade) {
                makeAiMove();
            }
        } else {
            console.error("Error from AI:", inferenceResult);
        }

        setLoading(false); // Скрыть индикатор загрузки
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
                className={`w-16 h-16 flex items-center justify-center transition-all duration-300 ${(row + col) % 2 === 0 ? 'bg-gray-300' : 'bg-gray-700'
                    } ${isSelected ? 'bg-blue-500' : ''} ${isLastMoveFrom || isLastMoveTo ? 'bg-yellow-300' : ''
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
            {loading && <div className="mt-4 mb-4 text-lg font-bold text-blue-500 animate-bounce">AI is thinking...</div>}
        </div>
    );
};

export default ChessBoardVSAI;
