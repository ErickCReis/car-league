import type { PlayerControls } from "./config/car";
import { World } from "./World";

export enum GameState {
  WAITING = "waiting",
  PLAYING = "playing",
  FINISHED = "finished",
}

export class Game {
  public state: GameState;
  public world: World;
  private players: Set<string>;
  private lastUpdateTime: number;

  constructor() {
    this.world = new World();
    this.players = new Set();
    this.state = GameState.WAITING;
    this.lastUpdateTime = Date.now();
  }

  addPlayer(playerId: string) {
    if (this.players.has(playerId)) return;

    this.world.addCar(playerId);
    this.players.add(playerId);

    if (this.players.size > 0 && this.state === GameState.WAITING) {
      this.state = GameState.PLAYING;
    }
  }

  removePlayer(playerId: string) {
    if (!this.players.has(playerId)) return;

    this.world.removeCar(playerId);
    this.players.delete(playerId);

    if (this.players.size === 0 && this.state === GameState.PLAYING) {
      this.state = GameState.WAITING;
    }
  }

  applyPlayerControls(playerId: string, controls: PlayerControls) {
    if (!this.players.has(playerId)) return;
    this.world.applyCarControls(playerId, controls);
  }

  update() {
    const now = Date.now();
    const deltaTime = (now - this.lastUpdateTime) / 1000;

    if (this.state === GameState.PLAYING) {
      this.world.update(deltaTime);
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
