'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

interface GameState {
  selectedGrade: string;
  selectedMode: string;
  score: number;
  health: number;
  questionsAnswered: number;
  currentQuestion: string | null;
  currentAnswer: number | null;
  timeLimit: number;
  gameRunning: boolean;
}

interface GameContextType {
  gameState: GameState;
  setSelectedGrade: (grade: string) => void;
  setSelectedMode: (mode: string) => void;
  setScore: (score: number) => void;
  setHealth: (health: number) => void;
  resetGame: () => void;
  updateGameState: (updates: Partial<GameState>) => void;
  loadHighScores: () => HighScore[];
  saveHighScore: (name: string, score: number) => void;
}

interface HighScore {
  name: string;
  score: number;
}

const initialState: GameState = {
  selectedGrade: 'kindergarten',
  selectedMode: 'endless',
  score: 0,
  health: 3,
  questionsAnswered: 0,
  currentQuestion: null,
  currentAnswer: null,
  timeLimit: 20,
  gameRunning: false,
};

const GameContext = createContext<GameContextType | undefined>(undefined);

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [gameState, setGameState] = useState<GameState>(() => {
    // Load saved grade and mode from localStorage on initial load
    if (typeof window !== 'undefined') {
      const savedGrade = localStorage.getItem('hedgieSelectedGrade');
      const savedMode = localStorage.getItem('hedgieSelectedMode');
      return {
        ...initialState,
        selectedGrade: savedGrade || initialState.selectedGrade,
        selectedMode: savedMode || initialState.selectedMode,
      };
    }
    return initialState;
  });

  const setSelectedGrade = (grade: string) => {
    setGameState(prev => ({ ...prev, selectedGrade: grade }));
    if (typeof window !== 'undefined') {
      localStorage.setItem('hedgieSelectedGrade', grade);
    }
  };

  const setSelectedMode = (mode: string) => {
    setGameState(prev => ({ ...prev, selectedMode: mode }));
    if (typeof window !== 'undefined') {
      localStorage.setItem('hedgieSelectedMode', mode);
    }
  };

  const setScore = (score: number) => {
    setGameState(prev => ({ ...prev, score }));
  };

  const setHealth = (health: number) => {
    setGameState(prev => ({ ...prev, health }));
  };

  const resetGame = () => {
    setGameState({
      ...initialState,
      selectedGrade: gameState.selectedGrade,
      selectedMode: gameState.selectedMode,
    });
  };

  const updateGameState = (updates: Partial<GameState>) => {
    setGameState(prev => ({ ...prev, ...updates }));
  };

  const loadHighScores = (): HighScore[] => {
    if (typeof window === 'undefined') return [];
    const stored = localStorage.getItem('hedgieHighScores');
    return stored ? JSON.parse(stored) : [];
  };

  const saveHighScore = (name: string, score: number) => {
    if (typeof window === 'undefined') return;

    let scores = loadHighScores();
    scores.push({ name, score });
    scores.sort((a, b) => b.score - a.score);
    scores = scores.slice(0, 5);
    localStorage.setItem('hedgieHighScores', JSON.stringify(scores));
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
