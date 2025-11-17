'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useGame } from '../context/GameContext';
import { useRouter } from 'next/navigation';
import RoughButton from '../components/RoughButton';

export default function Customize() {
  const { gameState, setSelectedGrade, setSelectedMode, resetGame } = useGame();
  const router = useRouter();
  const [localGrade, setLocalGrade] = useState(gameState.selectedGrade);
  const [localMode, setLocalMode] = useState(gameState.selectedMode);

  const handleGradeSelect = (grade: string) => {
    setLocalGrade(grade);
    setSelectedGrade(grade);
  };

  const handleModeSelect = (mode: string) => {
    setLocalMode(mode);
    setSelectedMode(mode);
  };

  const handleContinue = () => {
    resetGame();
    router.push('/game');
  };

  return (
    <div className="page-container peach-bg">
      <div className="container peach-bg" style={{ padding: '60px', border: 'none' }}>
        <h2 className="section-title">Grade:</h2>
        <div className="grade-grid">
          <RoughButton
            className={`btn-${localGrade === 'kindergarten' ? 'blue' : 'cyan'} grade-btn`}
            onClick={() => handleGradeSelect('kindergarten')}
          >
            Kindergarten
          </RoughButton>
          <RoughButton
            className={`btn-${localGrade === 'first' ? 'blue' : 'cyan'} grade-btn`}
            onClick={() => handleGradeSelect('first')}
          >
            First Grade
          </RoughButton>
          <RoughButton
            className={`btn-${localGrade === 'second' ? 'blue' : 'cyan'} grade-btn`}
            onClick={() => handleGradeSelect('second')}
          >
            Second Grade
          </RoughButton>
          <RoughButton
            className={`btn-${localGrade === 'third' ? 'blue' : 'cyan'} grade-btn`}
            onClick={() => handleGradeSelect('third')}
          >
            Third Grade
          </RoughButton>
          <RoughButton
            className={`btn-${localGrade === 'fourth' ? 'blue' : 'cyan'} grade-btn`}
            onClick={() => handleGradeSelect('fourth')}
          >
            Fourth Grade
          </RoughButton>
          <RoughButton
            className={`btn-${localGrade === 'fifth' ? 'blue' : 'cyan'} grade-btn`}
            onClick={() => handleGradeSelect('fifth')}
          >
            Fifth Grade
          </RoughButton>
        </div>

        <h2 className="section-title">Mode:</h2>
        <div className="mode-group">
          <RoughButton
            className={`btn-${localMode === 'endless' ? 'blue' : 'cyan'} mode-btn`}
            onClick={() => handleModeSelect('endless')}
          >
            Endless
          </RoughButton>
          <RoughButton
            className={`btn-${localMode === 'sprint' ? 'blue' : 'cyan'} mode-btn`}
            onClick={() => handleModeSelect('sprint')}
          >
            90 Second Sprint
          </RoughButton>
        </div>

        <div className="continue-container">
          <RoughButton className="btn-green btn-large" onClick={handleContinue}>
            Continue
          </RoughButton>
        </div>
      </div>
    </div>
  );
}
