import React from 'react';

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

const MoveHistory: React.FC<{ moves: { move: string, piece: string }[] }> = ({ moves }) => {
    return (
        <div className="w-72 border p-4 shadow-lg rounded-lg overflow-hidden flex flex-col">
            <h2 className="text-2xl mb-4 font-bold flex-shrink-0">Move History</h2>
            <div className="overflow-y-auto flex-grow">
                <ol className="space-y-2">
                    {moves.map((item, index) => (
                        <li key={index} className="flex items-center space-x-2">
                            <span className="text-2xl">{pieceIcons[item.piece]}</span>
                            <span>{item.move}</span>
                        </li>
                    ))}
                </ol>
            </div>
        </div>
    );
};

export default MoveHistory;
