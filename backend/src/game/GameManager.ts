import { WorldState } from "common";
import { Game, PlayerControls } from "./Game";

// Class to manage multiple game instances
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

  // Start the game update loop
  startUpdateLoop(intervalMs: number = 16) {
    // ~60fps
    if (this.updateInterval !== null) return;

    this.updateInterval = setInterval(() => {
      this.game.update();

      // Get the world state and notify all callbacks
      const worldState = this.game.getWorldState();
      for (const callback of this.updateCallbacks.values()) {
        callback(worldState);
      }
    }, intervalMs);
  }

  // Stop the game update loop
  stopUpdateLoop() {
    if (this.updateInterval === null) return;
    clearInterval(this.updateInterval);
    this.updateInterval = null;
  }

  // Register a callback to receive game state updates
  registerUpdateCallback(id: string, callback: (state: WorldState) => void) {
    this.updateCallbacks.set(id, callback);
  }

  // Unregister a callback
  unregisterUpdateCallback(id: string) {
    this.updateCallbacks.delete(id);
  }

  // Add a player to a game
  addPlayerToGame(playerId: string): void {
    // Add to new game
    this.startUpdateLoop();
    this.game.addPlayer(playerId);
  }

  // Remove a player from their current game
  removePlayerFromCurrentGame(playerId: string): void {
    this.game.removePlayer(playerId);

    // If game is empty, consider removing it
    if (this.game.getPlayerCount() === 0) {
      this.stopUpdateLoop();
    }
  }

  // Apply player controls to their car
  applyPlayerControls(playerId: string, controls: PlayerControls): void {
    this.game.applyPlayerControls(playerId, controls);
  }

  // Get all players in a game
  getGamePlayers(): string[] {
    return this.game.getPlayerIds();
  }
}
