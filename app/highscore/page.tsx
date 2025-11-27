'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useGame } from '../context/GameContext';

export default function Highscore() {
  const { gameState, loadHighScores, saveHighScore } = useGame();
  const [scores, setScores] = useState<Array<{ name: string; score: number }>>([]);
  const [playerName, setPlayerName] = useState('');
  const [showNameEntry, setShowNameEntry] = useState(false);

  useEffect(() => {
    const highScores = loadHighScores();
    setScores(highScores);

    // Check if player qualifies for top 5
    if (highScores.length < 5 || gameState.score > (highScores[highScores.length - 1]?.score || 0)) {
      setShowNameEntry(true);
    }
  }, []);

  const handleSaveScore = () => {
    const name = playerName.trim() || 'Anonymous';
    saveHighScore(name, gameState.score);
    setScores(loadHighScores());
    setShowNameEntry(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSaveScore();
    }
  };

  return (
    <div className="page-container blue-bg">
      <div className="container blue-bg" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px' }}>
        <h2 className="highscore-title">High Scores:</h2>

        <div className="highscore-table">
          <div className="table-header">
            <div className="table-cell">Name</div>
            <div className="table-cell">Score</div>
          </div>
          <div className="table-body">
            {[...Array(5)].map((_, index) => (
              <div key={index} className="table-row">
                <div>{scores[index]?.name || '-'}</div>
                <div>{scores[index]?.score || '-'}</div>
              </div>
            ))}
          </div>
        </div>

        {showNameEntry && (
          <div className="name-entry">
            <p className="congrats-text">Congratulations! You made it to the top 5!</p>
            <input
              type="text"
              className="name-input"
              placeholder="Enter your name"
              maxLength={20}
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              onKeyPress={handleKeyPress}
            />
            <button className="btn btn-green" onClick={handleSaveScore}>
              Save
            </button>
          </div>
        )}

        <div className="button-group">
          <Link href="/" className="btn btn-green">
            Home
          </Link>
          <Link href="/game" className="btn btn-yellow">
            Play Again
          </Link>
        </div>
      </div>
    </div>
  );
}
