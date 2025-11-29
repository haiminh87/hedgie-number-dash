'use server';

import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const DIFFICULTY_GUIDELINES: Record<string, string> = {
  easy: `EASY DIFFICULTY GUIDELINES:
- Use single-digit and simple two-digit numbers only
- Basic operations: addition/subtraction up to 100, simple multiplication (times tables up to 10)
- Simple division with no remainders
- Squares of numbers 1-10 only
- Simple percentages: 10%, 25%, 50%, 100%
- No fractions, no complex operations
- Example: "7 × 8 = ___", "45 + 32 = ___", "50% of 20 = ___"`,

  medium: `MEDIUM DIFFICULTY GUIDELINES:
- Two and three-digit numbers
- Multiplication of 2-digit × 1-digit, some 2-digit × 2-digit
- Division with remainders
- Squares up to 20, square roots of perfect squares up to 400
- Percentages including 15%, 20%, 30%, 40%, etc.
- Simple fractions addition/subtraction
- GCD/LCM with smaller numbers
- Order of operations with 2-3 operations
- Example: "16² = ___", "The remainder of 93 ÷ 4 is ___", "40% of 45 = ___"`,

  hard: `HARD DIFFICULTY GUIDELINES:
- Large numbers, 3-digit × 2-digit multiplication
- Complex multi-step calculations
- Squares up to 30, cubes, fourth powers
- Square roots of larger perfect squares
- Complex percentage problems
- Fraction operations including multiplication/division
- GCD/LCM with larger numbers
- Sequences requiring pattern recognition
- Roman numerals with larger values
- Multiple order of operations
- Example: "28² = ___", "√1764 = ___", "72 × 78 = ___", "5⁴ = ___"`,
};

const NUMBER_SENSE_PROMPT = `You are a math competition question generator for MathLeague.org Number Sense style problems. Generate questions that test mental math skills.

Question types to include (vary the types based on difficulty):
1. Basic arithmetic: addition, subtraction, multiplication, division
2. Powers and squares (e.g., "16² = ___", "5⁴ = ___")
3. Square roots (e.g., "√144 = ___")
4. Fractions: addition, subtraction, comparing fractions
5. Percentages (e.g., "40% of 45 is ___")
6. GCD and LCM problems
7. Remainders (e.g., "The remainder of 93 ÷ 4 is ___")
8. Roman numerals conversion
9. Unit conversions (e.g., "120 seconds is ___ minutes")
10. Digit problems (e.g., "The tens digit of 438 is ___")
11. Perimeter and area of basic shapes
12. Arithmetic sequences
13. Prime factorization related questions
14. Order of operations (e.g., "11 + 11 × 12 = ___")

IMPORTANT RULES:
- All answers must be integers or simple fractions
- For fraction answers, express as "a/b" format
- Questions should be solvable with mental math (no calculator)
- STRICTLY follow the difficulty guidelines provided
- Keep numbers appropriate for the specified difficulty level
- VARIETY IS CRITICAL: Each batch must include at least 8 different question types from the list above
- Use different numbers and operations in each question - avoid patterns like "X × 11" appearing multiple times
- Vary the format: some word problems, some symbolic (e.g., "16² = ___" vs "The square of 16 is ___")
- Do NOT repeat similar question structures within the same batch

{difficulty_guidelines}

Generate exactly {count} questions. Return a JSON array with objects containing:
- "question": the question text (use "___" for the blank)
- "answer": the numerical answer (as a string, fractions as "a/b")
- "type": the question type category

Example output format:
[
  {"question": "33 + 43 = ___", "answer": "76", "type": "addition"},
  {"question": "16² = ___", "answer": "256", "type": "squares"},
  {"question": "The remainder of 93 ÷ 4 is ___", "answer": "1", "type": "remainder"}
]

Return ONLY the JSON array, no other text.`;

export async function POST(request: Request) {
  try {
    const { count = 10, difficulty = 'medium' } = await request.json();

    const difficultyGuide = DIFFICULTY_GUIDELINES[difficulty] || DIFFICULTY_GUIDELINES.medium;
    const prompt = NUMBER_SENSE_PROMPT
      .replace('{count}', count.toString())
      .replace('{difficulty_guidelines}', difficultyGuide);

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: prompt,
        },
        {
          role: 'user',
          content: `Generate ${count} HIGHLY VARIED Number Sense style math questions at ${difficulty.toUpperCase()} difficulty level. IMPORTANT: Ensure maximum variety - use at least 8 different question types, different number ranges, and different phrasings. Avoid any repetitive patterns. Each question should feel unique.`,
        },
      ],
      temperature: 1.0,
      max_tokens: 2000,
    });

    const responseText = completion.choices[0]?.message?.content || '[]';

    // Parse the JSON response
    let questions;
    try {
      // Remove any markdown code blocks if present
      const cleanedResponse = responseText
        .replace(/```json\n?/g, '')
        .replace(/```\n?/g, '')
        .trim();
      questions = JSON.parse(cleanedResponse);
    } catch {
      console.error('Failed to parse OpenAI response:', responseText);
      return NextResponse.json(
        { error: 'Failed to parse questions' },
        { status: 500 }
      );
    }

    return NextResponse.json({ questions });
  } catch (error) {
    console.error('Error generating questions:', error);
    return NextResponse.json(
      { error: 'Failed to generate questions' },
      { status: 500 }
    );
  }
}
