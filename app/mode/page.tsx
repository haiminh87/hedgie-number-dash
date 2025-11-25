'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useGame } from '../context/GameContext';
import RoughButton from '../components/RoughButton';
import PageLayout from '../components/PageLayout';
import { GameMode } from '../types';

const MODES: { id: GameMode; label: string }[] = [
  { id: 'endless', label: 'Endless' },
  { id: 'sprint', label: '90 Second Sprint' },
];

export default function ModePage() {
  const { gameState, setSelectedMode, resetGame } = useGame();
  const router = useRouter();
  const [localMode, setLocalMode] = useState<GameMode>(gameState.selectedMode);

  const handleModeSelect = (mode: GameMode) => {
    setLocalMode(mode);
    setSelectedMode(mode);
  };

  const handleContinue = () => {
    resetGame();
    router.push('/game');
  };

  return (
    <PageLayout backgroundImage="/images/img_mode.png">
      <div style={{ height: '200px' }} />
      <div className="mode-buttons">
        {MODES.map(({ id, label }) => (
          <RoughButton
            key={id}
            className={`btn-${localMode === id ? 'blue' : 'cyan'} btn-large`}
            onClick={() => handleModeSelect(id)}
          >
            {label}
          </RoughButton>
        ))}
      </div>

      <div className="page-nav-button-left">
        <Link href="/grade-level" style={{ textDecoration: 'none' }}>
          <RoughButton className="btn-yellow btn-large">Back</RoughButton>
        </Link>
      </div>

      <div className="page-nav-button-right">
        <RoughButton className="btn-green btn-large" onClick={handleContinue}>
          Continue
        </RoughButton>
      </div>
    </PageLayout>
  );
}
