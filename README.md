# Car League

## Introduction

Car League is a 3D game inspired by Rocket League, where players control cars to play a soccer-like game with unique physics and mechanics. This project aims to create an engaging multiplayer experience with robust architecture and performance optimization.

The game features cars that can perform acrobatic maneuvers, boost mechanics, and physics-based ball interactions in a competitive arena setting. Our focus is on creating a simple yet engaging gameplay experience with solid technical foundations.

## Core Technologies

### Frontend
- **React**: For building the user interface and game menu components
- **Three.js**: 3D rendering library for creating the game world, cars, ball, and arena
- **React Three Fiber**: React renderer for Three.js, making it easier to build Three.js elements with React's component approach
- **React Three Drei**: Collection of useful helpers and abstractions for React Three Fiber
- **Zustand/Redux**: For state management across the application


### Backend
- **Cloudflare Durable Objects**: For maintaining game state and handling real-time multiplayer functionality
- **WebSockets**: For real-time bidirectional communication between clients and server
- **Cloudflare KV**: For storing game configurations, user profiles, and other non-relational data
- **Cloudflare D1**: SQL database for structured data like user accounts, match history, and leaderboards

### Physics & Game Logic
- **Rapier.js/Cannon.js**: Physics engine for realistic car and ball interactions
- **Custom game logic**: For implementing game rules, scoring, and match management

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
│
└── backend/            # Cloudflare Workers + Durable Objects
    ├── src/
    │   ├── durableObjects/ # Game session objects
    │   ├── api/            # API endpoints
    │   └── db/             # Database interactions
    └── wrangler.toml       # Cloudflare configuration
```

## Development Roadmap

1. **Phase 1**: Basic game mechanics and single-player mode
2. **Phase 2**: Multiplayer functionality with real-time synchronization
3. **Phase 3**: User accounts, matchmaking, and persistence
4. **Phase 4**: Advanced features (tournaments, custom cars, etc.)
5. **Phase 5**: Performance optimization and scaling