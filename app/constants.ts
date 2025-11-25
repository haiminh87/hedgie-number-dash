import { GradeLevel, QuestionTemplate } from './types';

// LocalStorage keys
export const STORAGE_KEYS = {
  SELECTED_GRADE: 'hedgieSelectedGrade',
  SELECTED_MODE: 'hedgieSelectedMode',
  HIGH_SCORES: 'hedgieHighScores',
} as const;

// Game configuration
export const GAME_CONFIG: {
  INITIAL_HEALTH: number;
  INITIAL_SCORE: number;
  POINTS_CORRECT: number;
  POINTS_WRONG: number;
  MAX_HIGH_SCORES: number;
  DEFAULT_TIME_LIMIT: number;
  SPRINT_DURATION: number;
} = {
  INITIAL_HEALTH: 3,
  INITIAL_SCORE: 0,
  POINTS_CORRECT: 5,
  POINTS_WRONG: 4,
  MAX_HIGH_SCORES: 5,
  DEFAULT_TIME_LIMIT: 20,
  SPRINT_DURATION: 90,
};

// Animation timings (in milliseconds)
export const ANIMATION_TIMING = {
  JUMP_DURATION: 1000,
  HURDLE_MOVE_INTERVAL: 16,
  HURDLE_RESET_DELAY: 50,
  NEW_QUESTION_DELAY: 500,
  WRONG_ANSWER_DELAY: 300,
};

// Hurdle positions
export const HURDLE_POSITIONS = {
  START: 600,
  OFF_SCREEN_LEFT: -400,
  OFF_SCREEN_RIGHT: 1200,
  MOVE_SPEED_FAST: 25,
  MOVE_SPEED_SLOW: 20,
};

// Colors
export const COLORS = {
  PRIMARY: '#2C3E50',
  GREEN: '#90EE90',
  YELLOW: '#FFE599',
  CYAN: '#A8E6E3',
  BLUE: '#5DADE2',
  PEACH: '#F4D6A0',
  ORANGE: '#FFB366',
};

// Page layout dimensions
export const PAGE_DIMENSIONS = {
  WIDTH: 1000,
  HEIGHT: 750,
  PADDING: 20,
};

// Question templates by grade level
export const QUESTION_TEMPLATES: Record<GradeLevel, QuestionTemplate[]> = {
  kindergarten: [
    { type: 'addition', max: 10 },
    { type: 'subtraction', max: 10 },
  ],
  first: [
    { type: 'addition', max: 20 },
    { type: 'subtraction', max: 20 },
  ],
  second: [
    { type: 'addition', max: 100 },
    { type: 'subtraction', max: 100 },
    { type: 'multiplication', max: 5 },
  ],
  third: [
    { type: 'addition', max: 1000 },
    { type: 'subtraction', max: 1000 },
    { type: 'multiplication', max: 10 },
  ],
  fourth: [
    { type: 'addition', max: 10000 },
    { type: 'subtraction', max: 10000 },
    { type: 'multiplication', max: 12 },
    { type: 'division', max: 12 },
  ],
  fifth: [
    { type: 'addition', max: 100000 },
    { type: 'subtraction', max: 100000 },
    { type: 'multiplication', max: 20 },
    { type: 'division', max: 20 },
  ],
};
