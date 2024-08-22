import React from 'react';

const MoveHistory: React.FC<{ moves: string[] }> = ({ moves }) => {
  return (
    <div className="w-72 border p-4 shadow-lg rounded-lg overflow-hidden flex flex-col">
      <h2 className="text-2xl mb-4 font-bold flex-shrink-0">Move History</h2>
      <div className="overflow-y-auto flex-grow">
        <ol className="space-y-2">
          {moves.map((move, index) => (
            <li key={index} className="flex justify-between">
              {move}
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
};

export default MoveHistory;