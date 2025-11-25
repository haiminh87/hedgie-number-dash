'use client';

import React, { createContext, useContext, useState } from 'react';
import { GameState, GradeLevel, GameMode, HighScore } from '../types';
import { STORAGE_KEYS, GAME_CONFIG } from '../constants';

interface GameContextType {
  gameState: GameState;
  setSelectedGrade: (grade: GradeLevel) => void;
  setSelectedMode: (mode: GameMode) => void;
  setScore: (score: number) => void;
  setHealth: (health: number) => void;
  resetGame: () => void;
  updateGameState: (updates: Partial<GameState>) => void;
  loadHighScores: () => HighScore[];
  saveHighScore: (name: string, score: number) => void;
}

const initialState: GameState = {
  selectedGrade: 'kindergarten',
  selectedMode: 'endless',
  score: GAME_CONFIG.INITIAL_SCORE,
  health: GAME_CONFIG.INITIAL_HEALTH,
  questionsAnswered: 0,
  currentQuestion: null,
  currentAnswer: null,
  timeLimit: GAME_CONFIG.DEFAULT_TIME_LIMIT,
  gameRunning: false,
};

const GameContext = createContext<GameContextType | undefined>(undefined);

function getStoredValue<T>(key: string, defaultValue: T): T {
  if (typeof window === 'undefined') return defaultValue;
  try {
    const stored = localStorage.getItem(key);
    return stored ? (stored as unknown as T) : defaultValue;
  } catch {
    return defaultValue;
  }
}

function setStoredValue(key: string, value: string): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, value);
  } catch {
    // Ignore localStorage errors
  }
}

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [gameState, setGameState] = useState<GameState>(() => {
    const savedGrade = getStoredValue<GradeLevel>(
      STORAGE_KEYS.SELECTED_GRADE,
      initialState.selectedGrade
    );
    const savedMode = getStoredValue<GameMode>(
      STORAGE_KEYS.SELECTED_MODE,
      initialState.selectedMode
    );
    return {
      ...initialState,
      selectedGrade: savedGrade,
      selectedMode: savedMode,
    };
  });

  const setSelectedGrade = (grade: GradeLevel) => {
    setGameState((prev) => ({ ...prev, selectedGrade: grade }));
    setStoredValue(STORAGE_KEYS.SELECTED_GRADE, grade);
  };

  const setSelectedMode = (mode: GameMode) => {
    setGameState((prev) => ({ ...prev, selectedMode: mode }));
    setStoredValue(STORAGE_KEYS.SELECTED_MODE, mode);
  };

  const setScore = (score: number) => {
    setGameState((prev) => ({ ...prev, score }));
  };

  const setHealth = (health: number) => {
    setGameState((prev) => ({ ...prev, health }));
  };

  const resetGame = () => {
    setGameState({
      ...initialState,
      selectedGrade: gameState.selectedGrade,
      selectedMode: gameState.selectedMode,
    });
  };

  const updateGameState = (updates: Partial<GameState>) => {
    setGameState((prev) => ({ ...prev, ...updates }));
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
      scores.push({ name, score });
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
        setSelectedGrade,
        setSelectedMode,
        setScore,
        setHealth,
        resetGame,
        updateGameState,
        loadHighScores,
        saveHighScore,
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
