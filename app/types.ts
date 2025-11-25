export type GradeLevel = 'kindergarten' | 'first' | 'second' | 'third' | 'fourth' | 'fifth';

export type GameMode = 'endless' | 'sprint';

export type QuestionType = 'addition' | 'subtraction' | 'multiplication' | 'division';

export interface QuestionTemplate {
  type: QuestionType;
  max: number;
}

export interface HighScore {
  name: string;
  score: number;
}

export interface GameState {
  selectedGrade: GradeLevel;
  selectedMode: GameMode;
  score: number;
  health: number;
  questionsAnswered: number;
  currentQuestion: string | null;
  currentAnswer: number | null;
  timeLimit: number;
  gameRunning: boolean;
}
