import { GeneratedQuestion } from '../types';

export async function fetchQuestionBatch(
  count: number = 20,
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
    { question: '33 + 43', answer: '76', type: 'addition' },
    { question: '276 + 532', answer: '808', type: 'addition' },
    { question: '732 - 485', answer: '247', type: 'subtraction' },
    { question: 'The remainder of 93 ÷ 4', answer: '1', type: 'remainder' },
    { question: '11 + 11 × 12', answer: '143', type: 'order_of_operations' },
    { question: '84 ÷ 6', answer: '14', type: 'division' },
    { question: '16 + 23 + 34 + 47', answer: '120', type: 'addition' },
    { question: 'The product of 17 and 7', answer: '119', type: 'multiplication' },
    { question: '54 × 11', answer: '594', type: 'multiplication' },
    { question: '16²', answer: '256', type: 'squares' },
    { question: '18 × 7 × 5', answer: '630', type: 'multiplication' },
    { question: '62 × 15', answer: '930', type: 'multiplication' },
    { question: '24 × 16', answer: '384', type: 'multiplication' },
    { question: '28²', answer: '784', type: 'squares' },
    { question: '27 + 23 + 19 + 15 + 11', answer: '95', type: 'addition' },
    { question: 'The GCD of 35 and 50', answer: '5', type: 'gcd_lcm' },
    { question: '40% of 45', answer: '18', type: 'percentages' },
    { question: '7200 seconds in minutes', answer: '120', type: 'unit_conversion' },
    { question: 'The LCM of 35 and 50', answer: '350', type: 'gcd_lcm' },
    { question: '72 × 78', answer: '5616', type: 'multiplication' },
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
    // Handle fractions safely
    const parseValue = (str: string): number | null => {
      if (str.includes('/')) {
        const parts = str.split('/');
        if (parts.length !== 2) return null;
        const num = Number(parts[0]);
        const denom = Number(parts[1]);
        if (isNaN(num) || isNaN(denom) || denom === 0) return null;
        return num / denom;
      }
      const value = parseFloat(str);
      return isNaN(value) ? null : value;
    };

    const userNum = parseValue(normalizedUser);
    const correctNum = parseValue(normalizedCorrect);

    // If either value couldn't be parsed, return false
    if (userNum === null || correctNum === null) {
      return false;
    }

    // Allow small floating point differences
    return Math.abs(userNum - correctNum) < 0.0001;
  } catch {
    return false;
  }
}
