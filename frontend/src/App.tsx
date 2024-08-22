import React, { useState, useEffect } from 'react';
import ChessBoard from './components/ChessBoard';
import Leaderboard from './components/LeaderBoard';
import MoveHistory from './components/MoveHistory';

const App: React.FC = () => {
  const initialTimeLimit = 30; // seconds
  const [moves, setMoves] = useState<{ move: string, piece: string }[]>([]);
  const [currentPlayer, setCurrentPlayer] = useState<'white' | 'black'>('white');
  const [timeLeft, setTimeLeft] = useState(initialTimeLimit);
  const [showAlert, setShowAlert] = useState(false);
  const [previousPlayer, setPreviousPlayer] = useState<'white' | 'black'>('white');

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setInterval(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearInterval(timer);
    } else {
      setPreviousPlayer(currentPlayer); // Set previous player before switching
      setShowAlert(true);
      switchPlayer();
    }
  }, [timeLeft]);

  const switchPlayer = () => {
    setCurrentPlayer(currentPlayer === 'white' ? 'black' : 'white');
    setTimeLeft(initialTimeLimit);
    setTimeout(() => setShowAlert(false), 3000); // Hide alert after 3 seconds
  };

  const handleMove = (move: string, piece: string) => {
    setMoves((prevMoves) => [...prevMoves, { move, piece }]);
    switchPlayer();
  };

  return (
    <div className="flex flex-col items-center h-screen p-4">
      <h1 className="text-4xl mb-4 font-bold">Chess 23</h1>
      {showAlert && (
        <div className="absolute top-0 left-0 bg-red-600 text-white px-4 py-2 m-4 rounded-md">
          Time is up! Switching turn to {previousPlayer === 'white' ? 'black' : 'white'}.
        </div>
      )}
      <div className="flex flex-grow w-full space-x-4 mt-4 relative">
        <Leaderboard />
        <div className="flex-grow flex flex-col items-center">
          <div className={`mb-4 text-2xl font-bold ${timeLeft <= 10 ? 'text-red-600' : ''}`}>
            {currentPlayer === 'white' ? 'White' : 'Black'}'s Turn - Time Left: {timeLeft}s
          </div>
          <ChessBoard onMove={handleMove} currentPlayer={currentPlayer} />
        </div>
        <MoveHistory moves={moves} />
      </div>
    </div>
  );
};

export default App;