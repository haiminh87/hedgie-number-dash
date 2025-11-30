import { Redis } from '@upstash/redis';
import { NextRequest, NextResponse } from 'next/server';
import { Difficulty, HighScore } from '../../types';

const redis = new Redis({
  url: process.env.KV_REST_API_URL!,
  token: process.env.KV_REST_API_TOKEN!,
});

const MAX_SCORES_PER_DIFFICULTY = 10;

function getKey(difficulty: Difficulty): string {
  return `highscores:${difficulty}`;
}

// GET /api/highscores?difficulty=easy|medium|hard
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const difficulty = searchParams.get('difficulty') as Difficulty | null;

  if (!difficulty || !['easy', 'medium', 'hard'].includes(difficulty)) {
    return NextResponse.json({ error: 'Invalid difficulty' }, { status: 400 });
  }

  try {
    const scores = await redis.get<HighScore[]>(getKey(difficulty));
    return NextResponse.json(scores || []);
  } catch (error) {
    console.error('Error fetching high scores:', error);
    return NextResponse.json({ error: 'Failed to fetch high scores' }, { status: 500 });
  }
}

// POST /api/highscores
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, score, difficulty } = body;

    if (!name || typeof score !== 'number' || !difficulty) {
      return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
    }

    if (!['easy', 'medium', 'hard'].includes(difficulty)) {
      return NextResponse.json({ error: 'Invalid difficulty' }, { status: 400 });
    }

    const key = getKey(difficulty);
    const existingScores = (await redis.get<HighScore[]>(key)) || [];

    const newScore: HighScore = {
      name: name.slice(0, 20), // Limit name length
      score,
      competition: 'mathleague',
      difficulty,
    };

    // Add new score and sort by score descending
    const updatedScores = [...existingScores, newScore]
      .sort((a, b) => b.score - a.score)
      .slice(0, MAX_SCORES_PER_DIFFICULTY);

    await redis.set(key, updatedScores);

    return NextResponse.json({ success: true, scores: updatedScores });
  } catch (error) {
    console.error('Error saving high score:', error);
    return NextResponse.json({ error: 'Failed to save high score' }, { status: 500 });
  }
}
