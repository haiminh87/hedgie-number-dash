import { GradeLevel, QuestionTemplate } from '../types';
import { QUESTION_TEMPLATES } from '../constants';

export interface GeneratedQuestion {
  questionText: string;
  correctAnswer: number;
}

export function generateQuestion(grade: GradeLevel): GeneratedQuestion {
  const templates = QUESTION_TEMPLATES[grade];
  const template = templates[Math.floor(Math.random() * templates.length)];

  return generateQuestionFromTemplate(template);
}

function generateQuestionFromTemplate(template: QuestionTemplate): GeneratedQuestion {
  switch (template.type) {
    case 'addition':
      return generateAddition(template.max);
    case 'subtraction':
      return generateSubtraction(template.max);
    case 'multiplication':
      return generateMultiplication(template.max);
    case 'division':
      return generateDivision(template.max);
    default:
      return generateAddition(template.max);
  }
}

function generateAddition(max: number): GeneratedQuestion {
  const num1 = Math.floor(Math.random() * max) + 1;
  const num2 = Math.floor(Math.random() * max) + 1;
  return {
    questionText: `${num1} + ${num2}`,
    correctAnswer: num1 + num2,
  };
}

function generateSubtraction(max: number): GeneratedQuestion {
  const num1 = Math.floor(Math.random() * max) + 1;
  const num2 = Math.floor(Math.random() * num1) + 1;
  return {
    questionText: `${num1} - ${num2}`,
    correctAnswer: num1 - num2,
  };
}

function generateMultiplication(max: number): GeneratedQuestion {
  const num1 = Math.floor(Math.random() * max) + 1;
  const num2 = Math.floor(Math.random() * max) + 1;
  return {
    questionText: `${num1} \u00D7 ${num2}`,
    correctAnswer: num1 * num2,
  };
}

function generateDivision(max: number): GeneratedQuestion {
  const divisor = Math.floor(Math.random() * max) + 1;
  const quotient = Math.floor(Math.random() * max) + 1;
  const dividend = divisor * quotient;
  return {
    questionText: `${dividend} \u00F7 ${divisor}`,
    correctAnswer: quotient,
  };
}
