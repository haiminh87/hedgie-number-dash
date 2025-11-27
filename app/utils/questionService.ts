import { GeneratedQuestion } from '../types';

const BATCH_SIZE = 20;

export async function fetchQuestionBatch(
  count: number = BATCH_SIZE,
  difficulty: 'easy' | 'medium' | 'hard' = 'medium'
): Promise<GeneratedQuestion[]> {
  try {
    const response = await fetch('/api/generate-questions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ count, difficulty }),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch questions');
    }

    const data = await response.json();
    return data.questions || [];
  } catch (error) {
    console.error('Error fetching questions:', error);
    // Return fallback questions if API fails
    return getFallbackQuestions();
  }
}

// Fallback questions in case API is unavailable
function getFallbackQuestions(): GeneratedQuestion[] {
  return [
    { question: '33 + 43 = ___', answer: '76', type: 'addition' },
    { question: '276 + 532 = ___', answer: '808', type: 'addition' },
    { question: '732 - 485 = ___', answer: '247', type: 'subtraction' },
    { question: 'The remainder of 93 ÷ 4 is ___', answer: '1', type: 'remainder' },
    { question: '11 + 11 × 12 = ___', answer: '143', type: 'order_of_operations' },
    { question: '84 ÷ 6 = ___', answer: '14', type: 'division' },
    { question: '16 + 23 + 34 + 47 = ___', answer: '120', type: 'addition' },
    { question: 'The product of 17 and 7 is ___', answer: '119', type: 'multiplication' },
    { question: '54 × 11 = ___', answer: '594', type: 'multiplication' },
    { question: '16² = ___', answer: '256', type: 'squares' },
    { question: '18 × 7 × 5 = ___', answer: '630', type: 'multiplication' },
    { question: '62 × 15 = ___', answer: '930', type: 'multiplication' },
    { question: '24 × 16 = ___', answer: '384', type: 'multiplication' },
    { question: '28² = ___', answer: '784', type: 'squares' },
    { question: '27 + 23 + 19 + 15 + 11 = ___', answer: '95', type: 'addition' },
    { question: 'The GCD of 35 and 50 is ___', answer: '5', type: 'gcd_lcm' },
    { question: '40% of 45 is ___', answer: '18', type: 'percentages' },
    { question: '7200 seconds is ___ minutes', answer: '120', type: 'unit_conversion' },
    { question: 'The LCM of 35 and 50 is ___', answer: '350', type: 'gcd_lcm' },
    { question: '72 × 78 = ___', answer: '5616', type: 'multiplication' },
  ];
}

// Normalize answer for comparison (handles fractions, whitespace, etc.)
export function normalizeAnswer(answer: string): string {
  return answer.trim().toLowerCase().replace(/\s+/g, '');
}

export function checkAnswer(userAnswer: string, correctAnswer: string): boolean {
  const normalizedUser = normalizeAnswer(userAnswer);
  const normalizedCorrect = normalizeAnswer(correctAnswer);

  // Direct match
  if (normalizedUser === normalizedCorrect) {
    return true;
  }

  // Try to compare as numbers
  try {
    // Handle fractions
    const parseValue = (str: string): number => {
      if (str.includes('/')) {
        const [num, denom] = str.split('/').map(Number);
        return num / denom;
      }
      return parseFloat(str);
    };

    const userNum = parseValue(normalizedUser);
    const correctNum = parseValue(normalizedCorrect);

    // Allow small floating point differences
    return Math.abs(userNum - correctNum) < 0.0001;
  } catch {
    return false;
  }
}
