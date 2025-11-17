# Hedgie Number Dash - Next.js Version

A production-quality educational math game built with Next.js, featuring proper page-by-page routing where each screen is a separate route.

## Features

### Proper Routing
Each screen is now a proper Next.js route:
- `/` - Home screen
- `/customize` - Grade and mode selection
- `/game` - Main gameplay
- `/highscore` - High score leaderboard
- `/instructions` - How to play tutorial

### Game Features
- **Game Modes**: Endless Mode and 90 Second Sprint
- **Difficulty Levels**: Kindergarten through Fifth Grade
- **Dynamic Question Generation**: Math problems tailored to each grade level
- **Scoring System**: +5 for correct, -4 for incorrect answers
- **Health System**: 3 hearts with visual feedback
- **Persistent High Scores**: Top 5 scores saved in localStorage
- **Smooth Animations**: Hedgehog jumping and blinking
- **Responsive Timer**: Decreases difficulty over time

## Getting Started

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
npm start
```

## Project Structure

```
app/
├── page.tsx                 # Home page (/)
├── layout.tsx               # Root layout with GameProvider
├── globals.css              # Global styles
├── context/
│   └── GameContext.tsx      # Game state management
├── customize/
│   └── page.tsx             # Customize page
├── game/
│   └── page.tsx             # Game page
├── highscore/
│   └── page.tsx             # High score page
└── instructions/
    └── page.tsx             # Instructions page
```

## Routes

- **/** - Home screen with start and instructions buttons
- **/customize** - Select grade level (K-5) and game mode
- **/game** - Main gameplay with questions and timer
- **/highscore** - View top 5 scores and save your name
- **/instructions** - 4-step tutorial on how to play

## Tech Stack

- Next.js 16 with App Router
- React 19 with TypeScript
- Context API for state management
- localStorage for high scores

---

© Hedgie Number Dash Studios
