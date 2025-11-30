'use client';

import React, { createContext, useContext, useState } from 'react';
import { GameState, Competition, HighScore, GeneratedQuestion, Difficulty } from '../types';

// Game configuration
const GAME_CONFIG = {
  INITIAL_HEALTH: 3,
  INITIAL_SCORE: 0,
  POINTS_CORRECT: 5,
  POINTS_WRONG: 4,
  MAX_HIGH_SCORES: 5,
};

const STORAGE_KEYS = {
  HIGH_SCORES: 'hedgieHighScores',
};

interface GameContextType {
  gameState: GameState;
  setScore: (score: number) => void;
  setHealth: (health: number) => void;
  setDifficulty: (difficulty: Difficulty) => void;
  resetGame: () => void;
  updateGameState: (updates: Partial<GameState>) => void;
  fetchHighScores: (difficulty: Difficulty) => Promise<HighScore[]>;
  saveHighScore: (name: string, score: number) => Promise<void>;
  setQuestions: (questions: GeneratedQuestion[]) => void;
  nextQuestion: () => void;
  getCurrentQuestion: () => GeneratedQuestion | null;
  config: typeof GAME_CONFIG;
}

const initialState: GameState = {
  competition: 'mathleague',
  difficulty: 'medium',
  score: GAME_CONFIG.INITIAL_SCORE,
  health: GAME_CONFIG.INITIAL_HEALTH,
  questionsAnswered: 0,
  currentQuestionIndex: 0,
  questions: [],
  isLoadingQuestions: false,
  gameRunning: false,
};

const GameContext = createContext<GameContextType | undefined>(undefined);

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [gameState, setGameState] = useState<GameState>(initialState);

  const setScore = (score: number) => {
    setGameState((prev) => ({ ...prev, score }));
  };

  const setHealth = (health: number) => {
    setGameState((prev) => ({ ...prev, health }));
  };

  const setDifficulty = (difficulty: Difficulty) => {
    setGameState((prev) => ({ ...prev, difficulty }));
  };

  const resetGame = () => {
    setGameState({
      ...initialState,
      competition: gameState.competition,
      difficulty: gameState.difficulty,
    });
  };

  const updateGameState = (updates: Partial<GameState>) => {
    setGameState((prev) => ({ ...prev, ...updates }));
  };

  const setQuestions = (questions: GeneratedQuestion[]) => {
    setGameState((prev) => ({
      ...prev,
      questions,
      currentQuestionIndex: 0,
      isLoadingQuestions: false,
    }));
  };

  const nextQuestion = () => {
    setGameState((prev) => ({
      ...prev,
      currentQuestionIndex: prev.currentQuestionIndex + 1,
      questionsAnswered: prev.questionsAnswered + 1,
    }));
  };

  const getCurrentQuestion = (): GeneratedQuestion | null => {
    if (gameState.currentQuestionIndex >= gameState.questions.length) {
      return null;
    }
    return gameState.questions[gameState.currentQuestionIndex];
  };

  const fetchHighScores = async (difficulty: Difficulty): Promise<HighScore[]> => {
    try {
      const response = await fetch(`/api/highscores?difficulty=${difficulty}`);
      if (!response.ok) {
        throw new Error('Failed to fetch high scores');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching high scores:', error);
      return [];
    }
  };

  const saveHighScore = async (name: string, score: number): Promise<void> => {
    try {
      const response = await fetch('/api/highscores', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          score,
          difficulty: gameState.difficulty,
        }),
      });
      if (!response.ok) {
        throw new Error('Failed to save high score');
      }
    } catch (error) {
      console.error('Error saving high score:', error);
    }
  };

  return (
    <GameContext.Provider
      value={{
        gameState,
        setScore,
        setHealth,
        setDifficulty,
        resetGame,
        updateGameState,
        fetchHighScores,
        saveHighScore,
        setQuestions,
        nextQuestion,
        getCurrentQuestion,
        config: GAME_CONFIG,
      }}
    >
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
}
