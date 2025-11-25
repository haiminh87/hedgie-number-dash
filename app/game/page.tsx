'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useGame } from '../context/GameContext';
import RoughButton from '../components/RoughButton';
import RoughBox from '../components/RoughBox';
import { generateQuestion } from '../utils/questionGenerator';
import { GradeLevel } from '../types';
import {
  GAME_CONFIG,
  ANIMATION_TIMING,
  HURDLE_POSITIONS,
  COLORS,
} from '../constants';

export default function Game() {
  const { gameState, updateGameState } = useGame();
  const router = useRouter();

  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState<number>(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [score, setScore] = useState(GAME_CONFIG.INITIAL_SCORE);
  const [health, setHealth] = useState(GAME_CONFIG.INITIAL_HEALTH);
  const [isJumping, setIsJumping] = useState(false);
  const [hurdlePosition, setHurdlePosition] = useState(HURDLE_POSITIONS.START);
  const [isHurdleMoving, setIsHurdleMoving] = useState(false);

  const moveIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const newHurdleIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const createNewQuestion = useCallback(() => {
    const { questionText, correctAnswer } = generateQuestion(
      gameState.selectedGrade as GradeLevel
    );
    setQuestion(questionText);
    setAnswer(correctAnswer);
  }, [gameState.selectedGrade]);

  // Initialize first question
  useEffect(() => {
    createNewQuestion();
  }, [createNewQuestion]);

  // Navigate to highscore when health depletes
  const hasNavigated = useRef(false);
  useEffect(() => {
    if (health <= 0 && !hasNavigated.current) {
      hasNavigated.current = true;
      updateGameState({ score });
      router.push('/highscore');
    }
  }, [health]);

  // Cleanup intervals on unmount
  useEffect(() => {
    return () => {
      if (moveIntervalRef.current) clearInterval(moveIntervalRef.current);
      if (newHurdleIntervalRef.current) clearInterval(newHurdleIntervalRef.current);
    };
  }, []);

  const animateHurdle = useCallback(() => {
    // Phase 1: Move hurdle off screen to the left (fast)
    setIsHurdleMoving(true);
    setHurdlePosition(HURDLE_POSITIONS.OFF_SCREEN_LEFT);

    // Phase 2: After hurdle exits left, instantly reset to right (no animation)
    setTimeout(() => {
      setIsHurdleMoving(false); // Disable transition briefly
      setHurdlePosition(HURDLE_POSITIONS.OFF_SCREEN_RIGHT);

      // Phase 3: Animate hurdle coming in from right (slower)
      setTimeout(() => {
        setIsHurdleMoving(true);
        setHurdlePosition(HURDLE_POSITIONS.START);

        // Animation complete
        setTimeout(() => {
          setIsHurdleMoving(false);
        }, 800);
      }, 50);
    }, 600); // Wait for exit animation to complete
  }, []);

  const handleSubmit = useCallback(() => {
    const userAns = parseInt(userAnswer, 10);
    if (isNaN(userAns)) return;

    if (userAns === answer) {
      setScore((prev) => prev + GAME_CONFIG.POINTS_CORRECT);
      setIsJumping(true);

      // Animate hurdle
      animateHurdle();

      // Generate new question when hurdle is off screen
      setTimeout(createNewQuestion, ANIMATION_TIMING.NEW_QUESTION_DELAY);

      // Stop jumping after animation completes
      setTimeout(() => setIsJumping(false), ANIMATION_TIMING.JUMP_DURATION);
    } else {
      setScore((prev) => Math.max(0, prev - GAME_CONFIG.POINTS_WRONG));
      setHealth((prev) => prev - 1);
      setTimeout(createNewQuestion, ANIMATION_TIMING.WRONG_ANSWER_DELAY);
    }

    setUserAnswer('');
  }, [userAnswer, answer, createNewQuestion, animateHurdle]);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  return (
    <div className="page-container peach-bg">
      <div className="page-content-wrapper">
        <div className="page-content-box">
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
              backgroundColor: COLORS.BLUE,
              padding: '0',
            }}
          >
            <div className="game-content-layer">
              {/* HUD */}
              <div className="game-hud">
                <RoughBox fillColor={COLORS.YELLOW} style={{ display: 'inline-block' }}>
                  <span className="score-text">Score: {score}</span>
                </RoughBox>
                <div className="hearts-container">
                  {[...Array(GAME_CONFIG.INITIAL_HEALTH)].map((_, i) => (
                    <span
                      key={i}
                      className={`heart ${i >= health ? 'lost' : ''}`}
                    >
                      ❤️
                    </span>
                  ))}
                </div>
              </div>

              {/* Hurdle with Question */}
              <div
                className="hurdle-container"
                style={{
                  left: `${hurdlePosition}px`,
                  transition: isHurdleMoving ? 'left 0.6s ease-in-out' : 'none',
                }}
              >
                <Image
                  src="/images/img_hurdle.png"
                  alt="Hurdle"
                  width={300}
                  height={300}
                  style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                />
                <div className="question-text">{question}</div>
              </div>

              {/* Hedgehog */}
              <div className={`hedgehog ${isJumping ? 'jumping' : ''}`}>
                <Image
                  src="/images/img_hedgehog.png"
                  alt="Hedgehog"
                  width={200}
                  height={200}
                  unoptimized
                  style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                />
              </div>

              {/* Answer Input */}
              <div className="answer-container">
                <div className="answer-input-group">
                  <RoughBox fillColor={COLORS.YELLOW} style={{ display: 'inline-block' }}>
                    <input
                      type="number"
                      className="answer-input-field"
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
            </div>
          </RoughBox>
        </div>
      </div>
    </div>
  );
}
