// src/App.tsx
import React, { useState, useEffect } from 'react';
import ChessBoard from './components/ChessBoard';
import Leaderboard from './components/LeaderBoard';
import MoveHistory from './components/MoveHistory';
import Onboarding from './components/Onboarding';
import LoginButton from "./components/LoginButton";
import { useInternetIdentity } from "ic-use-internet-identity";
import ChessBoardVSAI from './components/ChessBoardVSAI';

const App: React.FC = () => {
  const { loginStatus } = useInternetIdentity();
  const initialTimeLimit = 30; // seconds
  const [moves, setMoves] = useState<{ move: string, piece: string }[]>([]);
  const [currentPlayer, setCurrentPlayer] = useState<'white' | 'black'>('white');
  const [timeLeft, setTimeLeft] = useState(initialTimeLimit);
  const [showAlert, setShowAlert] = useState(false);
  const [previousPlayer, setPreviousPlayer] = useState<'white' | 'black'>('white');
  const [gameMode, setGameMode] = useState<'player-vs-player' | 'player-vs-ai' | null>(null);
  const [currentView, setCurrentView] = useState<'onboarding' | 'game' | 'under-construction'>('onboarding');

  useEffect(() => {
    if (timeLeft > 0 && gameMode === 'player-vs-player') {
      const timer = setInterval(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearInterval(timer);
    } else if (timeLeft === 0) {
      setPreviousPlayer(currentPlayer); // Set previous player before switching
      setShowAlert(true);
      switchPlayer();
    }
  }, [timeLeft, gameMode]);

  const switchPlayer = () => {
    setCurrentPlayer(currentPlayer === 'white' ? 'black' : 'white');
    setTimeLeft(initialTimeLimit);
    setTimeout(() => setShowAlert(false), 3000); // Hide alert after 3 seconds
  };

  const handleMove = (move: string, piece: string) => {
    setMoves((prevMoves) => [...prevMoves, { move, piece }]);
    switchPlayer();
  };

  const handleGameModeSelect = (mode: 'player-vs-player' | 'player-vs-ai') => {
    setGameMode(mode);
    if (mode === 'player-vs-ai') {
      setCurrentView('under-construction');
    } else {
      setCurrentView('game');
    }
  };

  if (loginStatus !== "success") {
    return (
      <div className="flex flex-col items-center justify-center h-screen p-4">
        <div className="absolute top-0 right-0 p-4">
          <LoginButton />
        </div>
        <Onboarding onSelectGameMode={handleGameModeSelect} shouldDisable={true} />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center h-screen p-4">
      <div className="absolute top-0 right-0 p-4">
        <LoginButton />
      </div>
      {currentView === 'onboarding' && (
        <div className="flex flex-col items-center justify-center h-full">
          <Onboarding onSelectGameMode={handleGameModeSelect} shouldDisable={false} />
        </div>
      )}
      {currentView === 'game' && (
        <div className="flex flex-col items-center h-full">
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
              <ChessBoard onMove={handleMove} />
            </div>
            <MoveHistory moves={moves} />
          </div>
        </div>
      )}
      {currentView === 'under-construction' && (
        <div className="flex justify-center items-center h-full">
          <h1 className="text-4xl mb-4 font-bold">This feature is under construction</h1>
        </div>
      )}
    </div>
  );
};

export default App;