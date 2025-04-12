import { PhysicsWorld } from "./PhysicsWorld";

// Game state enum
export enum GameState {
  WAITING = "waiting",
  PLAYING = "playing",
  FINISHED = "finished",
}

// Player controls interface
export interface PlayerControls {
  forward: boolean;
  backward: boolean;
  left: boolean;
  right: boolean;
  brake: boolean;
  reset: boolean;
}

// Game class to manage the game state and physics
export class Game {
  private physicsWorld: PhysicsWorld;
  private players: Map<
    string,
    { id: string; position: [number, number, number] }
  >;
  private state: GameState;
  private lastUpdateTime: number;

  constructor() {
    this.physicsWorld = new PhysicsWorld();
    this.players = new Map();
    this.state = GameState.WAITING;
    this.lastUpdateTime = Date.now();
  }

  // Get the current game state
  getState(): GameState {
    return this.state;
  }

  // Add a player to the game
  addPlayer(playerId: string): void {
    console.log("Adding player", playerId);
    // Default starting position
    const position: [number, number, number] = [0, 2, 0];

    // Create the player's car in the physics world
    this.physicsWorld.createCar(playerId, position);

    // Add player to our tracking
    this.players.set(playerId, { id: playerId, position });

    // If we have players, change state to playing
    if (this.players.size > 0 && this.state === GameState.WAITING) {
      this.state = GameState.PLAYING;
    }
  }

  // Remove a player from the game
  removePlayer(playerId: string): void {
    console.log("Removing player", playerId);

    // Remove the player's car from the physics world
    this.physicsWorld.removeCar(playerId);

    // Remove from our tracking
    this.players.delete(playerId);

    // If no players left, change state back to waiting
    if (this.players.size === 0 && this.state === GameState.PLAYING) {
      this.state = GameState.WAITING;
    }
  }

  // Apply controls for a specific player
  applyPlayerControls(playerId: string, controls: PlayerControls): void {
    if (!this.players.has(playerId)) return;

    this.physicsWorld.applyCarControls(playerId, controls);
  }

  // Update the game state (run physics simulation)
  update(): void {
    const now = Date.now();
    const deltaTime = (now - this.lastUpdateTime) / 1000; // Convert to seconds

    // Only update if we're in playing state
    if (this.state === GameState.PLAYING) {
      this.physicsWorld.update(deltaTime);
    }

    this.lastUpdateTime = now;
  }

  // Get the current state of all objects for sending to clients
  getWorldState() {
    return this.physicsWorld.getWorldState();
  }

  // Check if a player is in this game
  hasPlayer(playerId: string): boolean {
    return this.players.has(playerId);
  }

  // Get the number of players
  getPlayerCount(): number {
    return this.players.size;
  }

  // Get all player IDs
  getPlayerIds(): string[] {
    return Array.from(this.players.keys());
  }
}
