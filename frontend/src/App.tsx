import React, { useState } from 'react';
import ChessBoard from './components/ChessBoard';
import Leaderboard from './components/LeaderBoard';
import MoveHistory from './components/MoveHistory';

const App: React.FC = () => {
  const [moves, setMoves] = useState<{ move: string, piece: string }[]>([]);

  const handleMove = (move: string, piece: string) => {
    setMoves((prevMoves) => [...prevMoves, { move, piece }]);
  };

  return (
    <div className="flex flex-col items-center h-screen p-4">
      <h1 className="text-4xl mb-4 font-bold">Chess 23</h1>
      <div className="flex flex-grow w-full space-x-4 mt-4">
        <Leaderboard />
        <div className="flex-grow flex flex-col items-center">
          <ChessBoard onMove={handleMove} />
        </div>
        <MoveHistory moves={moves} />
      </div>
    </div>
  );
};

export default App;