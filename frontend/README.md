# Car League

## Introduction

Car League is a 3D game inspired by Rocket League, where players control cars to play a soccer-like game with unique physics and mechanics. This project aims to create an engaging multiplayer experience with robust architecture and performance optimization.

The game features cars that can perform acrobatic maneuvers, boost mechanics, and physics-based ball interactions in a competitive arena setting. Our focus is on creating a simple yet engaging gameplay experience with solid technical foundations.

## Core Technologies

- **React**: For building the user interface and game menu components
- **Three.js**: 3D rendering library for creating the game world, cars, ball, and arena
- **React Three Fiber**: React renderer for Three.js, making it easier to build Three.js elements with React's component approach
- **React Three Drei**: Collection of useful helpers and abstractions for React Three Fiber
- **Zustand/Redux**: For state management across the application

## Project Structure

The project will follow a modular architecture to ensure maintainability and scalability:

```
car-league/
├── frontend/           # React + Three.js application
│   ├── src/
│   │   ├── components/ # UI components
│   │   ├── game/       # Game-specific components and logic
│   │   ├── models/     # 3D models and assets
│   │   └── state/      # State management
│   └── public/         # Static assets
```

## Code guidelines

- Use TypeScript for type safety
- Follow the React Hooks best practices
- Use "export function name() {}" style for function and components
- do not use barrel index.ts files, use named exports and direct files imports
- make small files, with a single responsibility
- use tailwindcss for styling, we are using v4, not nedd for tailwind.config.js
- shadcn ui is allready installed and ready to use, use it for ui components
