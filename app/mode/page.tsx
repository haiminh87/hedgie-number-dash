'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useGame } from '../context/GameContext';
import RoughButton from '../components/RoughButton';
import RoughBox from '../components/RoughBox';
import Link from 'next/link';

export default function Mode() {
  const { gameState, setSelectedMode, resetGame } = useGame();
  const router = useRouter();
  const [localMode, setLocalMode] = useState(gameState.selectedMode);

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
              backgroundImage: 'url(/images/img_mode.png)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat'
            }}
          >
            <div style={{ height: '200px' }} />
            <div style={{
              display: 'flex',
              gap: '30px',
              justifyContent: 'center',
              padding: '0 80px',
              maxWidth: '800px',
              margin: '0 auto'
            }}>
              <RoughButton
                className={`btn-${localMode === 'endless' ? 'blue' : 'cyan'} btn-large`}
                onClick={() => handleModeSelect('endless')}
              >
                Endless
              </RoughButton>
              <RoughButton
                className={`btn-${localMode === 'sprint' ? 'blue' : 'cyan'} btn-large`}
                onClick={() => handleModeSelect('sprint')}
              >
                90 Second Sprint
              </RoughButton>
            </div>
          </RoughBox>

          {/* Back button - bottom left */}
          <div style={{
            position: 'absolute',
            bottom: '40px',
            left: '40px'
          }}>
            <Link href="/grade-level" style={{ textDecoration: 'none' }}>
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
