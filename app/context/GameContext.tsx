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
  loadHighScores: () => HighScore[];
  saveHighScore: (name: string, score: number) => void;
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

  const loadHighScores = (): HighScore[] => {
    if (typeof window === 'undefined') return [];
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.HIGH_SCORES);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  };

  const saveHighScore = (name: string, score: number) => {
    if (typeof window === 'undefined') return;
    try {
      let scores = loadHighScores();
      scores.push({ name, score, competition: gameState.competition });
      scores.sort((a, b) => b.score - a.score);
      scores = scores.slice(0, GAME_CONFIG.MAX_HIGH_SCORES);
      localStorage.setItem(STORAGE_KEYS.HIGH_SCORES, JSON.stringify(scores));
    } catch {
      // Ignore localStorage errors
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
        loadHighScores,
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
