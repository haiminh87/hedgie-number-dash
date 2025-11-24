'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useGame } from '../context/GameContext';
import RoughButton from '../components/RoughButton';
import RoughBox from '../components/RoughBox';
import Link from 'next/link';

export default function GradeLevel() {
  const { gameState, setSelectedGrade } = useGame();
  const router = useRouter();
  const [localGrade, setLocalGrade] = useState(gameState.selectedGrade);

  const handleGradeSelect = (grade: string) => {
    setLocalGrade(grade);
    setSelectedGrade(grade);
  };

  const handleContinue = () => {
    router.push('/mode');
  };

  return (
    <div className="page-container peach-bg">
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: '100%',
        padding: '20px'
      }}>
        <div style={{
          position: 'relative',
          width: '1000px',
          height: '750px'
        }}>
          <RoughBox
            fillColor="transparent"
            style={{
              width: '100%',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              position: 'relative',
              overflow: 'visible',
              backgroundImage: 'url(/images/img_grade_level.png)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat'
            }}
          >
            <div style={{ height: '200px' }} />
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '20px',
              padding: '0 80px',
              maxWidth: '900px',
              margin: '0 auto'
            }}>
              <RoughButton
                className={`btn-${localGrade === 'kindergarten' ? 'blue' : 'cyan'} btn-large`}
                onClick={() => handleGradeSelect('kindergarten')}
              >
                Kindergarten
              </RoughButton>
              <RoughButton
                className={`btn-${localGrade === 'first' ? 'blue' : 'cyan'} btn-large`}
                onClick={() => handleGradeSelect('first')}
              >
                First Grade
              </RoughButton>
              <RoughButton
                className={`btn-${localGrade === 'second' ? 'blue' : 'cyan'} btn-large`}
                onClick={() => handleGradeSelect('second')}
              >
                Second Grade
              </RoughButton>
              <RoughButton
                className={`btn-${localGrade === 'third' ? 'blue' : 'cyan'} btn-large`}
                onClick={() => handleGradeSelect('third')}
              >
                Third Grade
              </RoughButton>
              <RoughButton
                className={`btn-${localGrade === 'fourth' ? 'blue' : 'cyan'} btn-large`}
                onClick={() => handleGradeSelect('fourth')}
              >
                Fourth Grade
              </RoughButton>
              <RoughButton
                className={`btn-${localGrade === 'fifth' ? 'blue' : 'cyan'} btn-large`}
                onClick={() => handleGradeSelect('fifth')}
              >
                Fifth Grade
              </RoughButton>
            </div>
          </RoughBox>

          {/* Back button - bottom left */}
          <div style={{
            position: 'absolute',
            bottom: '40px',
            left: '40px'
          }}>
            <Link href="/" style={{ textDecoration: 'none' }}>
              <RoughButton className="btn-yellow btn-large">
                Back
              </RoughButton>
            </Link>
          </div>

          {/* Continue button - bottom right */}
          <div style={{
            position: 'absolute',
            bottom: '40px',
            right: '40px'
          }}>
            <RoughButton className="btn-green btn-large" onClick={handleContinue}>
              Continue
            </RoughButton>
          </div>
        </div>
      </div>
    </div>
  );
}
