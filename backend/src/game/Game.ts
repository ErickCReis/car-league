import type { WorldState } from "common";
import type { PlayerControls } from "game";
import { PhysicsWorld } from "./PhysicsWorld";

export enum GameState {
  WAITING = "waiting",
  PLAYING = "playing",
  FINISHED = "finished",
}

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

  getState(): GameState {
    return this.state;
  }

  addPlayer(playerId: string): void {
    const position: [number, number, number] = [0, 2, 0];

    this.physicsWorld.createCar(playerId, position);

    this.players.set(playerId, { id: playerId, position });

    if (this.players.size > 0 && this.state === GameState.WAITING) {
      this.state = GameState.PLAYING;
    }
  }

  removePlayer(playerId: string): void {
    this.physicsWorld.removeCar(playerId);

    this.players.delete(playerId);

    if (this.players.size === 0 && this.state === GameState.PLAYING) {
      this.state = GameState.WAITING;
    }
  }

  applyPlayerControls(playerId: string, controls: PlayerControls): void {
    if (!this.players.has(playerId)) return;

    this.physicsWorld.applyCarControls(playerId, controls);
  }

  update(): void {
    const now = Date.now();
    const deltaTime = (now - this.lastUpdateTime) / 1000;

    if (this.state === GameState.PLAYING) {
      this.physicsWorld.update(deltaTime);
    }

    this.lastUpdateTime = now;
  }

  getWorldState(): WorldState {
    return this.physicsWorld.getWorldState();
  }

  hasPlayer(playerId: string): boolean {
    return this.players.has(playerId);
  }

  getPlayerCount(): number {
    return this.players.size;
  }

  getPlayerIds(): string[] {
    return Array.from(this.players.keys());
  }
}
