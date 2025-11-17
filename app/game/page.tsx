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
  const [timeRemaining, setTimeRemaining] = useState(20);
  const [score, setScore] = useState(0);
  const [health, setHealth] = useState(3);
  const [isJumping, setIsJumping] = useState(false);
  const [isBlinking, setIsBlinking] = useState(false);
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

    switch(template.type) {
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
    setTimeRemaining(20);
  };

  useEffect(() => {
    generateQuestion();
  }, []);

  useEffect(() => {
    if (timerRef.current) clearInterval(timerRef.current);

    timerRef.current = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 0.1) {
          handleTimeout();
          return 20;
        }
        return prev - 0.1;
      });
    }, 100);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [question]);

  useEffect(() => {
    if (health <= 0) {
      updateGameState({ score });
      router.push('/highscore');
    }
  }, [health]);

  const handleTimeout = () => {
    setHealth((prev) => prev - 1);
    setIsBlinking(true);
    setTimeout(() => {
      setIsBlinking(false);
      generateQuestion();
    }, 900);
  };

  const handleSubmit = () => {
    const userAns = parseInt(userAnswer);
    if (isNaN(userAns)) return;

    if (userAns === answer) {
      setScore((prev) => prev + 5);
      setIsJumping(true);
      setTimeout(() => {
        setIsJumping(false);
        generateQuestion();
      }, 600);
    } else {
      setScore((prev) => Math.max(0, prev - 4));
      setHealth((prev) => prev - 1);
      setIsBlinking(true);
      setTimeout(() => {
        setIsBlinking(false);
        generateQuestion();
      }, 900);
    }

    setUserAnswer('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  return (
    <div className="page-container game-bg">
      <div className="game-container">
        {/* HUD */}
        <div className="hud">
          <RoughBox fillColor="#FFE599" style={{ display: 'inline-block' }}>
            <span style={{ fontFamily: 'Virgil, cursive', fontSize: '24px', fontWeight: 700, color: '#2C3E50' }}>
              Score: {score}
            </span>
          </RoughBox>
          <div className="hearts-display">
            {[...Array(3)].map((_, i) => (
              <span key={i} className={`heart ${i >= health ? 'lost' : ''}`}>
                ❤️
              </span>
            ))}
          </div>
        </div>

        {/* Game Canvas */}
        <div className="game-canvas">
          {/* Question */}
          <RoughBox fillColor="#FFE599" style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 50,
            minWidth: '300px'
          }}>
            <div style={{
              fontSize: '48px',
              fontWeight: 700,
              color: '#2C3E50',
              textAlign: 'center',
              fontFamily: 'Virgil, cursive'
            }}>
              {question}
            </div>
          </RoughBox>

          {/* Timer */}
          <div className="timer-bar-container">
            <div
              className={`timer-bar ${timeRemaining / 20 <= 0.25 ? 'danger' : timeRemaining / 20 <= 0.5 ? 'warning' : ''}`}
              style={{ width: `${(timeRemaining / 20) * 100}%` }}
            ></div>
          </div>

          {/* Game Scene */}
          <div className="game-scene">
            <div className={`hedgehog ${isJumping ? 'jumping' : ''} ${isBlinking ? 'blinking' : ''}`}>
              <Image src="/images/img_hedgehog.png" alt="Hedgehog" width={100} height={100} />
            </div>
          </div>

          {/* Ground */}
          <div className="ground"></div>
        </div>

        {/* Answer Input */}
        <div className="answer-area">
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
          <RoughButton className="btn-green btn-submit" onClick={handleSubmit}>
            Submit
          </RoughButton>
        </div>
      </div>
    </div>
  );
}
