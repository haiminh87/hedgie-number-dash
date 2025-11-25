'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useGame } from '../context/GameContext';
import RoughButton from '../components/RoughButton';
import PageLayout from '../components/PageLayout';
import { GradeLevel } from '../types';

const GRADES: { id: GradeLevel; label: string }[] = [
  { id: 'kindergarten', label: 'Kindergarten' },
  { id: 'first', label: 'First Grade' },
  { id: 'second', label: 'Second Grade' },
  { id: 'third', label: 'Third Grade' },
  { id: 'fourth', label: 'Fourth Grade' },
  { id: 'fifth', label: 'Fifth Grade' },
];

export default function GradeLevelPage() {
  const { gameState, setSelectedGrade } = useGame();
  const router = useRouter();
  const [localGrade, setLocalGrade] = useState<GradeLevel>(gameState.selectedGrade);

  const handleGradeSelect = (grade: GradeLevel) => {
    setLocalGrade(grade);
    setSelectedGrade(grade);
  };

  const handleContinue = () => {
    router.push('/mode');
  };

  return (
    <PageLayout backgroundImage="/images/img_grade_level.png">
      <div style={{ height: '200px' }} />
      <div className="grade-grid">
        {GRADES.map(({ id, label }) => (
          <RoughButton
            key={id}
            className={`btn-${localGrade === id ? 'blue' : 'cyan'} btn-large`}
            onClick={() => handleGradeSelect(id)}
          >
            {label}
          </RoughButton>
        ))}
      </div>

      <div className="page-nav-button-left">
        <Link href="/" style={{ textDecoration: 'none' }}>
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
