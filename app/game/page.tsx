'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useGame } from '../context/GameContext';
import Image from 'next/image';
import RoughButton from '../components/RoughButton';
import RoughBox from '../components/RoughBox';

export default function Game() {
  const { gameState, updateGameState } = useGame();
  const router = useRouter();
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState<number>(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [score, setScore] = useState(0);
  const [health, setHealth] = useState(3);
  const [isJumping, setIsJumping] = useState(false);
  const [hurdlePosition, setHurdlePosition] = useState(600); // Position from left
  const [isHurdleMoving, setIsHurdleMoving] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const questionTemplates: any = {
    kindergarten: [
      { type: 'addition', max: 10 },
      { type: 'subtraction', max: 10 }
    ],
    first: [
      { type: 'addition', max: 20 },
      { type: 'subtraction', max: 20 }
    ],
    second: [
      { type: 'addition', max: 100 },
      { type: 'subtraction', max: 100 },
      { type: 'multiplication', max: 5 }
    ],
    third: [
      { type: 'addition', max: 1000 },
      { type: 'subtraction', max: 1000 },
      { type: 'multiplication', max: 10 }
    ],
    fourth: [
      { type: 'addition', max: 10000 },
      { type: 'subtraction', max: 10000 },
      { type: 'multiplication', max: 12 },
      { type: 'division', max: 12 }
    ],
    fifth: [
      { type: 'addition', max: 100000 },
      { type: 'subtraction', max: 100000 },
      { type: 'multiplication', max: 20 },
      { type: 'division', max: 20 }
    ]
  };

  const generateQuestion = () => {
    const templates = questionTemplates[gameState.selectedGrade];
    const template = templates[Math.floor(Math.random() * templates.length)];

    let questionText, correctAnswer;

    switch (template.type) {
      case 'addition':
        const add1 = Math.floor(Math.random() * template.max) + 1;
        const add2 = Math.floor(Math.random() * template.max) + 1;
        questionText = `${add1} + ${add2}`;
        correctAnswer = add1 + add2;
        break;

      case 'subtraction':
        const sub1 = Math.floor(Math.random() * template.max) + 1;
        const sub2 = Math.floor(Math.random() * sub1) + 1;
        questionText = `${sub1} - ${sub2}`;
        correctAnswer = sub1 - sub2;
        break;

      case 'multiplication':
        const mult1 = Math.floor(Math.random() * template.max) + 1;
        const mult2 = Math.floor(Math.random() * template.max) + 1;
        questionText = `${mult1} × ${mult2}`;
        correctAnswer = mult1 * mult2;
        break;

      case 'division':
        const divisor = Math.floor(Math.random() * template.max) + 1;
        const quotient = Math.floor(Math.random() * template.max) + 1;
        const dividend = divisor * quotient;
        questionText = `${dividend} ÷ ${divisor}`;
        correctAnswer = quotient;
        break;
    }

    setQuestion(questionText!);
    setAnswer(correctAnswer!);
  };

  useEffect(() => {
    generateQuestion();
  }, []);


  useEffect(() => {
    if (health <= 0) {
      updateGameState({ score });
      router.push('/highscore');
    }
  }, [health]);


  const handleSubmit = () => {
    const userAns = parseInt(userAnswer);
    if (isNaN(userAns)) return;

    if (userAns === answer) {
      setScore((prev) => prev + 5);
      setIsJumping(true);
      setIsHurdleMoving(true);

      // Move hurdle to the left
      const moveInterval = setInterval(() => {
        setHurdlePosition((prev) => {
          if (prev <= -200) {
            clearInterval(moveInterval);
            return 1000; // Reset to right side
          }
          return prev - 20;
        });
      }, 16);

      setTimeout(() => {
        setIsJumping(false);
        setIsHurdleMoving(false);
        generateQuestion();
        clearInterval(moveInterval);
        setHurdlePosition(600); // Reset hurdle position
      }, 600);
    } else {
      setScore((prev) => Math.max(0, prev - 4));
      setHealth((prev) => prev - 1);
      setTimeout(() => {
        generateQuestion();
      }, 300);
    }

    setUserAnswer('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
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
              position: 'relative',
              overflow: 'hidden',
              backgroundImage: 'url(/images/img_game.png)',
              backgroundSize: 'auto 100%',
              backgroundPosition: 'left center',
              backgroundRepeat: 'repeat-x',
              backgroundColor: '#5DADE2',
              padding: '0'
            }}
          >
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%'
            }}>
              {/* HUD */}
              <div style={{
                position: 'absolute',
                top: '20px',
                left: '0',
                right: '0',
                display: 'flex',
                justifyContent: 'space-between',
                padding: '0 40px',
                zIndex: 100
              }}>
                <RoughBox fillColor="#FFE599" style={{ display: 'inline-block' }}>
                  <span style={{ fontFamily: 'Virgil, cursive', fontSize: '24px', fontWeight: 700, color: '#2C3E50' }}>
                    Score: {score}
                  </span>
                </RoughBox>
                <div style={{ display: 'flex', gap: '15px', fontSize: '40px' }}>
                  {[...Array(3)].map((_, i) => (
                    <span key={i} style={{
                      filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2))',
                      opacity: i >= health ? 0.3 : 1
                    }}>
                      ❤️
                    </span>
                  ))}
                </div>
              </div>

              {/* Hurdle with Question */}
              <div style={{
                position: 'absolute',
                top: '350px',
                left: `${hurdlePosition}px`,
                width: '300px',
                height: '300px',
                zIndex: 20,
                transition: isHurdleMoving ? 'none' : 'left 0.3s ease'
              }}>
                <Image
                  src="/images/img_hurdle.png"
                  alt="Hurdle"
                  width={300}
                  height={300}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain'
                  }}
                />
                {/* Question on top of hurdle */}
                <div style={{
                  position: 'absolute',
                  top: '80px',
                  left: '0',
                  right: '0',
                  zIndex: 50,
                  fontSize: '42px',
                  fontWeight: 700,
                  color: '#2C3E50',
                  textAlign: 'center',
                  fontFamily: 'Virgil, cursive',
                  textShadow: '2px 2px 0px rgba(255, 255, 255, 0.8)',
                  padding: '0 10px',
                  wordWrap: 'break-word',
                  lineHeight: '1.2'
                }}>
                  {question}
                </div>
              </div>


              {/* Game Scene */}
              <div
                className={`hedgehog ${isJumping ? 'jumping' : ''}`}
                style={{
                  position: 'absolute',
                  top: '430px',
                  left: '80px',
                  width: '200px',
                  height: '200px',
                  zIndex: 10
                }}
              >
                <Image
                  src="/images/img_hedgehog.png"
                  alt="Hedgehog"
                  width={200}
                  height={200}
                  unoptimized
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain'
                  }}
                />
              </div>


              {/* Answer Input */}
              <div style={{
                position: 'absolute',
                bottom: '30px',
                right: '40px',
                display: 'flex',
                gap: '20px',
                zIndex: 100
              }}>
                <RoughBox fillColor="#FFE599" style={{ display: 'inline-block' }}>
                  <input
                    type="number"
                    style={{
                      width: '250px',
                      padding: '10px',
                      fontSize: '24px',
                      fontWeight: 700,
                      border: 'none',
                      background: 'transparent',
                      color: '#2C3E50',
                      fontFamily: 'Virgil, cursive',
                      outline: 'none'
                    }}
                    placeholder="Your answer"
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    onKeyPress={handleKeyPress}
                    autoFocus
                  />
                </RoughBox>
                <RoughButton className="btn-green btn-large" onClick={handleSubmit}>
                  Submit
                </RoughButton>
              </div>
            </div>
          </RoughBox>
        </div>
      </div>
    </div>
  );
}
