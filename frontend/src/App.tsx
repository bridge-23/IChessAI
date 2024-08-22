import React from 'react';
import ChessBoard from './components/ChessBoard';

const App: React.FC = () => {
  return (
    <div className="flex flex-col items-center mt-8">
      <h1 className="text-4xl mb-8">Chess 23</h1>
      <ChessBoard />
    </div>
  );
};

export default App;