import React, { useState } from 'react';
import dynamic from 'next/dynamic';

// Dynamically import the P5Wrapper component
const DynamicP5Wrapper = dynamic(() => import('./p5Wrapper'), { ssr: false });

const QuickGame: React.FC = () => {
  // Define the gameStarted state
  const [gameStarted, setGameStarted] = useState(false);

  const startGame = () => {
    setGameStarted(true);
  };

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: '#4074b5',
        height: '30vh',
        overflow: 'hidden',
        width: '99.1vw',
        flexDirection: 'column',
      }}
    >
      {/* Display the Play Game button if the game has not started */}
      {!gameStarted && (
        <button
          style={buttonStyle}
          onClick={startGame}
        >
          Play Game
        </button>
      )}

      {/* Display the game when it starts */}
      {gameStarted && <DynamicP5Wrapper gameStarted={gameStarted} setGameStarted={setGameStarted} />}
    </div>
  );
};

const buttonStyle = {
  backgroundColor: '#F5A623',
  color: '#FFF',
  padding: '15px 30px',
  fontSize: '18px',
  border: 'none',
  cursor: 'pointer',
  fontFamily: 'monospace', // Pixelated font for button
  margin: '20px',
};

export default QuickGame;
