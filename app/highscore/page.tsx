'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useGame } from '../context/GameContext';
import PageLayout from '../components/PageLayout';
import RoughButton from '../components/RoughButton';
import RoughBox from '../components/RoughBox';
import { Difficulty, HighScore } from '../types';

const DIFFICULTIES: { id: Difficulty; label: string }[] = [
  { id: 'easy', label: 'Easy' },
  { id: 'medium', label: 'Medium' },
  { id: 'hard', label: 'Hard' },
];

export default function Highscore() {
  const { gameState, fetchHighScores, saveHighScore, updateGameState } = useGame();
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty>(gameState.difficulty);
  const [scores, setScores] = useState<HighScore[]>([]);
  const [playerName, setPlayerName] = useState('');
  const [scoreSaved, setScoreSaved] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const loadScores = useCallback(async (difficulty: Difficulty) => {
    setIsLoading(true);
    const highScores = await fetchHighScores(difficulty);
    setScores(highScores);
    setIsLoading(false);
    return highScores;
  }, [fetchHighScores]);

  useEffect(() => {
    loadScores(selectedDifficulty);
  }, [selectedDifficulty, loadScores]);

  const handleSaveScore = async () => {
    setIsSaving(true);
    const name = playerName.trim() || 'Anonymous';
    await saveHighScore(name, gameState.score);
    await loadScores(selectedDifficulty);
    updateGameState({ showNameEntry: false });
    setScoreSaved(true);
    setIsSaving(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isSaving) {
      handleSaveScore();
    }
  };

  const handleTabChange = (difficulty: Difficulty) => {
    setSelectedDifficulty(difficulty);
  };

  return (
    <PageLayout backgroundClass="peach-bg" backgroundImage="/images/img_background_highscores.png">
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          height: '100%',
          padding: '20px 40px',
        }}
      >
        {/* Spacer to reserve space for title in background */}
        <div style={{ height: '110px' }} />

        {/* Difficulty Tabs */}
        <div
          style={{
            display: 'flex',
            gap: '10px',
            marginBottom: '15px',
          }}
        >
          {DIFFICULTIES.map(({ id, label }) => (
            <RoughButton
              key={id}
              className={`${selectedDifficulty === id ? 'btn-blue' : 'btn-cyan'}`}
              onClick={() => handleTabChange(id)}
            >
              {label}
            </RoughButton>
          ))}
        </div>

        {/* Scores Table Container */}
        <RoughBox
          fillColor="#FFB366"
          style={{
            width: '100%',
            maxWidth: '600px',
            flex: 1,
            maxHeight: '350px',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {/* Table Header */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '60px 1fr 100px',
              borderBottom: '4px solid #2C3E50',
              padding: '15px 10px',
            }}
          >
            <div className="highscore-table-header-cell">#</div>
            <div className="highscore-table-header-cell">Name</div>
            <div className="highscore-table-header-cell">Score</div>
          </div>

          {/* Scrollable Table Body */}
          <div
            style={{
              flex: 1,
              overflowY: 'auto',
              overflowX: 'hidden',
            }}
          >
            {isLoading ? (
              <div className="highscore-empty-message">Loading...</div>
            ) : scores.length === 0 ? (
              <div className="highscore-empty-message">No scores yet. Be the first!</div>
            ) : (
              scores.map((score, index) => (
                <div
                  key={index}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '60px 1fr 100px',
                    borderBottom: index < scores.length - 1 ? '2px solid #2C3E50' : 'none',
                    padding: '12px 10px',
                  }}
                >
                  <div className="highscore-table-cell">{index + 1}</div>
                  <div
                    className="highscore-table-cell"
                    style={{
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {score.name}
                  </div>
                  <div className="highscore-table-cell">{score.score}</div>
                </div>
              ))
            )}
          </div>
        </RoughBox>

      </div>

      {/* Name Entry Dialog */}
      {gameState.showNameEntry && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
          }}
        >
          <RoughBox
            fillColor="#FFE599"
            style={{
              padding: '40px 50px',
              textAlign: 'center',
              maxWidth: '450px',
            }}
          >
            <h2 className="highscore-dialog-title">New High Score!</h2>
            <p className="highscore-dialog-subtitle">
              You scored {gameState.score} points!
            </p>
            <input
              type="text"
              className="name-input"
              placeholder="Enter your name"
              maxLength={20}
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              onKeyDown={handleKeyPress}
              disabled={isSaving}
              autoFocus
              style={{
                width: '100%',
                padding: '15px 20px',
                fontSize: '22px',
                marginBottom: '20px',
                boxSizing: 'border-box',
              }}
            />
            <RoughButton className="btn-green btn-large" onClick={handleSaveScore} disabled={isSaving}>
              {isSaving ? 'Saving...' : 'Save Score'}
            </RoughButton>
          </RoughBox>
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="page-nav-button-left">
        <Link href="/" style={{ textDecoration: 'none' }}>
          <RoughButton className="btn-yellow btn-large">Home</RoughButton>
        </Link>
      </div>

      <div className="page-nav-button-right">
        <Link href="/difficulty" style={{ textDecoration: 'none' }}>
          <RoughButton className="btn-green btn-large">Play Again</RoughButton>
        </Link>
      </div>
    </PageLayout>
  );
}
