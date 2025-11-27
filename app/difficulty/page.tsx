'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useGame } from '../context/GameContext';
import RoughButton from '../components/RoughButton';
import PageLayout from '../components/PageLayout';
import { Difficulty } from '../types';

const DIFFICULTIES: { id: Difficulty; label: string; description: string }[] = [
  { id: 'easy', label: 'Easy', description: 'Basic arithmetic, simple operations' },
  { id: 'medium', label: 'Medium', description: 'Mixed operations, fractions, percentages' },
  { id: 'hard', label: 'Hard', description: 'Complex problems, sequences, geometry' },
];

export default function DifficultyPage() {
  const { gameState, setDifficulty, resetGame } = useGame();
  const router = useRouter();
  const [localDifficulty, setLocalDifficulty] = useState<Difficulty>(gameState.difficulty);

  const handleDifficultySelect = (difficulty: Difficulty) => {
    setLocalDifficulty(difficulty);
    setDifficulty(difficulty);
  };

  const handleContinue = () => {
    resetGame();
    router.push('/game');
  };

  return (
    <PageLayout backgroundImage="/images/img_mode.png">
      <div style={{ height: '180px' }} />
      <div className="difficulty-buttons">
        {DIFFICULTIES.map(({ id, label, description }) => (
          <div key={id} style={{ textAlign: 'center', marginBottom: '10px' }}>
            <RoughButton
              className={`btn-${localDifficulty === id ? 'blue' : 'cyan'} btn-large`}
              onClick={() => handleDifficultySelect(id)}
            >
              {label}
            </RoughButton>
            <div
              style={{
                fontSize: '14px',
                color: '#2C3E50',
                marginTop: '5px',
                fontFamily: 'Virgil, cursive',
              }}
            >
              {description}
            </div>
          </div>
        ))}
      </div>

      <div className="page-nav-button-left">
        <Link href="/" style={{ textDecoration: 'none' }}>
          <RoughButton className="btn-yellow btn-large">Back</RoughButton>
        </Link>
      </div>

      <div className="page-nav-button-right">
        <RoughButton className="btn-green btn-large" onClick={handleContinue}>
          Start
        </RoughButton>
      </div>
    </PageLayout>
  );
}
