'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useGame } from '../context/GameContext';
import RoughButton from '../components/RoughButton';
import PageLayout from '../components/PageLayout';
import { Difficulty } from '../types';

const DIFFICULTIES: { id: Difficulty; label: string }[] = [
  { id: 'easy', label: 'Easy' },
  { id: 'medium', label: 'Medium' },
  { id: 'hard', label: 'Hard' },
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
    <PageLayout backgroundImage="/images/img_background_level.png">
      <div style={{ height: '180px' }} />
      <div className="difficulty-buttons">
        {DIFFICULTIES.map(({ id, label }) => (
          <div key={id} style={{ marginBottom: '10px' }}>
            <RoughButton
              className={`btn-${localDifficulty === id ? 'blue' : 'cyan'} btn-large`}
              onClick={() => handleDifficultySelect(id)}
            >
              {label}
            </RoughButton>
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
