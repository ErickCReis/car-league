# Car League

## Introduction

Car League is a 3D game inspired by Rocket League, where players control cars to play a soccer-like game with unique physics and mechanics. This project aims to create an engaging multiplayer experience with robust architecture and performance optimization.

The game features cars that can perform acrobatic maneuvers, boost mechanics, and physics-based ball interactions in a competitive arena setting. Our focus is on creating a simple yet engaging gameplay experience with solid technical foundations.

## Project Structure

The project follows a modular architecture with four main packages:

```
car-league/
├── frontend/           # React + Three.js application
│   ├── src/
│   │   ├── components/ # UI components
│   │   ├── game/       # Game-specific components and rendering
│   │   ├── routes/     # Application routes
│   │   └── state/      # State management
│   └── public/         # Static assets
│
├── backend/            # Cloudflare Workers + Durable Objects
│   └── src/
│       ├── game/       # Server-side game logic
│       └── ws.ts       # WebSocket handling
│
├── game/               # Shared game logic and physics
│   └── src/
│       ├── arena/      # Arena-related code
│       ├── ball/       # Ball-related code
│       ├── car/        # Car-related code
│       ├── wheel/      # Wheel-related code
│       └── world/      # Physics world code
│
└── common/             # Shared types and utilities
    └── src/
        └── common.ts   # Common types and utilities
```

## Core Technologies

### Frontend

- **React**: For building the user interface and game menu components
- **Three.js**: 3D rendering library for creating the game world
- **React Three Fiber**: React renderer for Three.js
- **React Three Drei**: Helpers and abstractions for React Three Fiber
- **XState**: For state management
- **TanStack Router**: For routing
- **Tailwind CSS**: For styling
- **shadcn/ui**: For UI components

### Backend

- **Cloudflare Workers**: For serverless functions
- **Cloudflare Durable Objects**: For maintaining game state
- **WebSockets**: For real-time communication
- **Hono**: For API routing

### Physics & Game Logic

- **Cannon.js**: Physics engine for realistic car and ball interactions

## Development Setup

### Prerequisites

- Node.js (v18+)
- pnpm (v10+)

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/car-league.git
cd car-league

# Install dependencies
pnpm install
```

### Development

```bash
# Start all services in development mode
pnpm dev

# Build all packages
pnpm build

# Run code checks
pnpm check
```

## Code Organization

The game package contains shared code organized by entity (car, ball, arena) rather than by function type. This approach ensures that related code stays together and makes it easier to understand the codebase.

## Contributing

Contributions are welcome! Please follow these guidelines:

1. Use TypeScript for type safety
2. Follow React Hooks best practices
3. Use "export function name() {}" style for functions and components
4. Make small files with a single responsibility
5. Use Tailwind CSS for styling
6. Use shadcn/ui for UI components when appropriate

## License

MIT
