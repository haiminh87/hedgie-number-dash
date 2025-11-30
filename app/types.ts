export type Competition = 'mathleague';

export type Difficulty = 'easy' | 'medium' | 'hard';

export type NumberSenseQuestionType =
  | 'addition'
  | 'subtraction'
  | 'multiplication'
  | 'division'
  | 'squares'
  | 'square_roots'
  | 'fractions'
  | 'percentages'
  | 'gcd_lcm'
  | 'remainder'
  | 'roman_numerals'
  | 'unit_conversion'
  | 'digit_problems'
  | 'perimeter_area'
  | 'sequences'
  | 'prime_factors'
  | 'order_of_operations';

export interface GeneratedQuestion {
  question: string;
  answer: string;
  type: NumberSenseQuestionType;
}

export interface HighScore {
  name: string;
  score: number;
  competition: Competition;
  difficulty: Difficulty;
}

export interface GameState {
  competition: Competition;
  difficulty: Difficulty;
  score: number;
  health: number;
  questionsAnswered: number;
  currentQuestionIndex: number;
  questions: GeneratedQuestion[];
  isLoadingQuestions: boolean;
  gameRunning: boolean;
  showNameEntry: boolean;
}
