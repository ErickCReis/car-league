import type { WorldState } from "common";
import type { PlayerControls } from "game";
import { Game } from "./Game";

export class GameManager {
  private game: Game;
  private updateInterval: Timer | null;
  private updateCallbacks: Map<string, (state: WorldState) => void>;

  constructor() {
    this.game = new Game();
    this.updateInterval = null;
    this.updateCallbacks = new Map();

    this.startUpdateLoop();
  }

  startUpdateLoop(intervalMs: number = 16): void {
    if (this.updateInterval !== null) return;

    this.updateInterval = setInterval(() => {
      this.game.update();

      const worldState = this.game.getWorldState();
      for (const callback of this.updateCallbacks.values()) {
        callback(worldState);
      }
    }, intervalMs);
  }

  stopUpdateLoop(): void {
    if (this.updateInterval === null) return;
    clearInterval(this.updateInterval);
    this.updateInterval = null;
  }

  registerUpdateCallback(
    id: string,
    callback: (state: WorldState) => void,
  ): void {
    this.updateCallbacks.set(id, callback);
  }

  unregisterUpdateCallback(id: string): void {
    this.updateCallbacks.delete(id);
  }

  addPlayerToGame(playerId: string): void {
    this.startUpdateLoop();
    this.game.addPlayer(playerId);
  }

  removePlayerFromCurrentGame(playerId: string): void {
    this.game.removePlayer(playerId);

    if (this.game.getPlayerCount() === 0) {
      this.stopUpdateLoop();
    }
  }

  applyPlayerControls(playerId: string, controls: PlayerControls): void {
    this.game.applyPlayerControls(playerId, controls);
  }

  getGamePlayers(): string[] {
    return this.game.getPlayerIds();
  }
}
