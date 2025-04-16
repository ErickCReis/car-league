import type { PlayerControls } from "./config/car";
import { PhysicsWorld } from "./PhysicsWorld";

export enum GameState {
  WAITING = "waiting",
  PLAYING = "playing",
  FINISHED = "finished",
}

export class Game {
  public state: GameState;
  public physicsWorld: PhysicsWorld;
  private players: Set<string>;
  private lastUpdateTime: number;

  constructor() {
    this.physicsWorld = new PhysicsWorld();
    this.players = new Set();
    this.state = GameState.WAITING;
    this.lastUpdateTime = Date.now();
  }

  addPlayer(playerId: string) {
    if (this.players.has(playerId)) return;

    this.physicsWorld.addCar(playerId);
    this.players.add(playerId);

    if (this.players.size > 0 && this.state === GameState.WAITING) {
      this.state = GameState.PLAYING;
    }
  }

  removePlayer(playerId: string) {
    if (!this.players.has(playerId)) return;

    this.physicsWorld.removeCar(playerId);
    this.players.delete(playerId);

    if (this.players.size === 0 && this.state === GameState.PLAYING) {
      this.state = GameState.WAITING;
    }
  }

  applyPlayerControls(playerId: string, controls: PlayerControls) {
    if (!this.players.has(playerId)) return;
    this.physicsWorld.applyCarControls(playerId, controls);
  }

  update() {
    const now = Date.now();
    const deltaTime = (now - this.lastUpdateTime) / 1000;

    if (this.state === GameState.PLAYING) {
      this.physicsWorld.update(deltaTime);
    }

    this.lastUpdateTime = now;
  }

  hasPlayer(playerId: string) {
    return this.players.has(playerId);
  }

  getPlayerCount() {
    return this.players.size;
  }

  getPlayerIds() {
    return Array.from(this.players.keys());
  }
}
