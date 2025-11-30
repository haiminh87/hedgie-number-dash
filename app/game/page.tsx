'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useGame } from '../context/GameContext';
import RoughButton from '../components/RoughButton';
import RoughBox from '../components/RoughBox';
import { fetchQuestionBatch, checkAnswer } from '../utils/questionService';

// Animation timings (in milliseconds)
const ANIMATION_TIMING = {
  JUMP_DURATION: 1000,
  NEW_QUESTION_DELAY: 500,
  WRONG_ANSWER_DELAY: 300,
};

// Timer settings
const QUESTION_TIME_LIMIT = 30; // seconds per question

// Hurdle positions
const HURDLE_POSITIONS = {
  START: 600,
  OFF_SCREEN_LEFT: -400,
  OFF_SCREEN_RIGHT: 1200,
};

// Colors
const COLORS = {
  YELLOW: '#FFE599',
  BLUE: '#5DADE2',
};

// Get font size class based on question length to ensure it fits in 2 lines
function getQuestionFontClass(question: string | undefined): string {
  if (!question) return '';
  const length = question.length;
  if (length > 45) return 'tiny-font';
  if (length > 35) return 'extra-small-font';
  if (length > 22) return 'small-font';
  return '';
}

export default function Game() {
  const {
    gameState,
    updateGameState,
    setQuestions,
    nextQuestion,
    getCurrentQuestion,
    fetchHighScores,
    config,
  } = useGame();
  const router = useRouter();

  const [userAnswer, setUserAnswer] = useState('');
  const [score, setScore] = useState(config.INITIAL_SCORE);
  const [health, setHealth] = useState(config.INITIAL_HEALTH);
  const [isJumping, setIsJumping] = useState(false);
  const [hurdlePosition, setHurdlePosition] = useState(HURDLE_POSITIONS.START);
  const [isHurdleMoving, setIsHurdleMoving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingMessage, setLoadingMessage] = useState('Generating questions...');
  const [timeLeft, setTimeLeft] = useState(QUESTION_TIME_LIMIT);
  const [hedgehogX, setHedgehogX] = useState(-150);
  const [hedgehogFrame, setHedgehogFrame] = useState(1);

  const hasNavigated = useRef(false);
  const hasInitialized = useRef(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const timeoutHandled = useRef(false);

  // Load questions on mount
  useEffect(() => {
    if (hasInitialized.current) return;
    hasInitialized.current = true;

    const loadQuestions = async () => {
      setIsLoading(true);
      setLoadingMessage('Generating MathLeague Number Sense questions...');

      try {
        const questions = await fetchQuestionBatch(20, gameState.difficulty);
        setQuestions(questions);
      } catch (error) {
        console.error('Failed to load questions:', error);
        setLoadingMessage('Using practice questions...');
        // Fallback is handled in fetchQuestionBatch
        const questions = await fetchQuestionBatch(20, gameState.difficulty);
        setQuestions(questions);
      }

      setIsLoading(false);
    };

    loadQuestions();
  }, [setQuestions]);

  // Animate running hedgehog during loading
  useEffect(() => {
    if (!isLoading) return;

    const SCREEN_WIDTH = 1000;
    const HEDGEHOG_WIDTH = 150;
    const SPEED = 5;

    const moveInterval = setInterval(() => {
      setHedgehogX((prev) => {
        if (prev > SCREEN_WIDTH) {
          return -HEDGEHOG_WIDTH;
        }
        return prev + SPEED;
      });
    }, 30);

    const frameInterval = setInterval(() => {
      setHedgehogFrame((prev) => (prev === 1 ? 2 : 1));
    }, 150);

    return () => {
      clearInterval(moveInterval);
      clearInterval(frameInterval);
    };
  }, [isLoading]);

  // Navigate to highscore when health depletes
  useEffect(() => {
    if (health <= 0 && !hasNavigated.current) {
      hasNavigated.current = true;

      const checkAndNavigate = async () => {
        // Fetch current highscores to check if player qualifies
        const highScores = await fetchHighScores(gameState.difficulty);
        const qualifies = highScores.length < 10 ||
          score > (highScores[highScores.length - 1]?.score || 0);

        // Update game state with score and qualification status
        updateGameState({ score, showNameEntry: qualifies });
        router.push('/highscore');
      };

      checkAndNavigate();
    }
  }, [health, score, updateGameState, router, fetchHighScores, gameState.difficulty]);

  // Load more questions when running low
  useEffect(() => {
    const remainingQuestions =
      gameState.questions.length - gameState.currentQuestionIndex;

    if (remainingQuestions <= 5 && !gameState.isLoadingQuestions && !isLoading) {
      updateGameState({ isLoadingQuestions: true });

      fetchQuestionBatch(15, gameState.difficulty).then((newQuestions) => {
        updateGameState({
          questions: [...gameState.questions, ...newQuestions],
          isLoadingQuestions: false,
        });
      });
    }
  }, [
    gameState.currentQuestionIndex,
    gameState.questions.length,
    gameState.isLoadingQuestions,
    gameState.questions,
    isLoading,
    updateGameState,
  ]);

  // Reset timer when question changes
  useEffect(() => {
    setTimeLeft(QUESTION_TIME_LIMIT);
    timeoutHandled.current = false;
  }, [gameState.currentQuestionIndex]);

  // Countdown timer
  useEffect(() => {
    if (isLoading || health <= 0) return;

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          // Time's up - treat as wrong answer
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isLoading, health, gameState.currentQuestionIndex]);

  // Handle timeout
  useEffect(() => {
    if (timeLeft === 0 && !isLoading && health > 0 && !timeoutHandled.current) {
      timeoutHandled.current = true;
      setScore((prev) => Math.max(0, prev - config.POINTS_WRONG));
      setHealth((prev) => prev - 1);
      setTimeout(() => {
        nextQuestion();
      }, ANIMATION_TIMING.WRONG_ANSWER_DELAY);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft, isLoading]);

  const animateHurdle = useCallback(() => {
    // Phase 1: Move hurdle off screen to the left (fast)
    setIsHurdleMoving(true);
    setHurdlePosition(HURDLE_POSITIONS.OFF_SCREEN_LEFT);

    // Phase 2: After hurdle exits left, instantly reset to right (no animation)
    setTimeout(() => {
      setIsHurdleMoving(false);
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
    }, 600);
  }, []);

  const handleSubmit = useCallback(() => {
    if (!userAnswer.trim()) return;
    if (timeLeft === 0) return; // Don't process if timer ran out

    const currentQ = getCurrentQuestion();
    if (!currentQ) return;

    const isCorrect = checkAnswer(userAnswer, currentQ.answer);

    if (isCorrect) {
      setScore((prev) => prev + config.POINTS_CORRECT);
      setIsJumping(true);

      // Animate hurdle
      animateHurdle();

      // Move to next question
      setTimeout(() => {
        nextQuestion();
      }, ANIMATION_TIMING.NEW_QUESTION_DELAY);

      // Stop jumping after animation completes
      setTimeout(() => setIsJumping(false), ANIMATION_TIMING.JUMP_DURATION);
    } else {
      setScore((prev) => Math.max(0, prev - config.POINTS_WRONG));
      setHealth((prev) => prev - 1);
      setTimeout(() => {
        nextQuestion();
      }, ANIMATION_TIMING.WRONG_ANSWER_DELAY);
    }

    setUserAnswer('');
  }, [userAnswer, getCurrentQuestion, nextQuestion, animateHurdle, config, timeLeft]);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  const currentQuestion = getCurrentQuestion();

  if (isLoading) {
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
                backgroundImage: 'url(/images/img_background_loading.png)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            >
              {/* Running Hedgehog */}
              <div
                style={{
                  position: 'absolute',
                  bottom: '80px',
                  left: `${hedgehogX}px`,
                  width: '150px',
                  height: '150px',
                }}
              >
                <Image
                  src={`/images/img_running_${hedgehogFrame}.png`}
                  alt="Running Hedgehog"
                  width={150}
                  height={150}
                  style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                  unoptimized
                />
              </div>
              {/* Loading Message */}
              <div
                style={{
                  position: 'absolute',
                  top: '40%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  textAlign: 'center',
                }}
              >
                <RoughBox
                  fillColor={COLORS.YELLOW}
                  style={{
                    display: 'inline-block',
                    padding: '20px 40px',
                  }}
                >
                  <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#2C3E50' }}>
                    {loadingMessage}
                  </div>
                </RoughBox>
              </div>
            </RoughBox>
          </div>
        </div>
      </div>
    );
  }

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
                <RoughBox
                  fillColor={COLORS.YELLOW}
                  style={{ display: 'inline-block' }}
                >
                  <span className="score-text">Score: {score}</span>
                </RoughBox>
                <RoughBox
                  fillColor={timeLeft <= 10 ? '#FF6B6B' : COLORS.YELLOW}
                  style={{ display: 'inline-block' }}
                >
                  <span className={`timer-text ${timeLeft <= 10 ? 'timer-warning' : ''}`}>
                    {timeLeft}s
                  </span>
                </RoughBox>
                <div className="hearts-container">
                  {[...Array(config.INITIAL_HEALTH)].map((_, i) => (
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
                <div className={`question-text ${getQuestionFontClass(currentQuestion?.question)}`}>
                  {currentQuestion?.question || 'Loading...'}
                </div>
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
                  <RoughBox
                    fillColor={COLORS.YELLOW}
                    style={{ display: 'inline-block' }}
                  >
                    <input
                      type="text"
                      className="answer-input-field"
                      placeholder="Your answer"
                      value={userAnswer}
                      onChange={(e) => setUserAnswer(e.target.value)}
                      onKeyPress={handleKeyPress}
                      autoFocus
                    />
                  </RoughBox>
                  <RoughButton
                    className="btn-green btn-large"
                    onClick={handleSubmit}
                  >
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
