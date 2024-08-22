import React from 'react';

interface OnboardingProps {
  onSelectGameMode: (mode: 'player-vs-player' | 'player-vs-ai') => void;
}

const Onboarding: React.FC<OnboardingProps> = ({ onSelectGameMode }) => {
  return (
    <div className="flex flex-col items-center justify-center h-screen space-y-4">
      <h1 className="text-4xl font-bold mb-8">Choose Game Mode</h1>
      <button
        onClick={() => onSelectGameMode('player-vs-player')}
        className="px-6 py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600"
      >
        Player vs Player
      </button>
      <button
        onClick={() => onSelectGameMode('player-vs-ai')}
        className="px-6 py-3 bg-green-500 text-white rounded-md hover:bg-green-600"
      >
        Player vs AI
      </button>
    </div>
  );
};

export default Onboarding;