import type { WorldState } from "common";
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
  private score: { team1: number; team2: number };
  private lastGoal?: { team: 1 | 2; time: number };

  constructor() {
    this.world = new World();
    this.players = new Set();
    this.state = GameState.WAITING;
    this.lastUpdateTime = Date.now();
    this.score = { team1: 0, team2: 0 };

    // Set up goal detection
    this.setupGoalDetection();
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

  getWorldState(): WorldState {
    // Get the base state from the world
    const state = this.world.getState();

    // Add the score information
    state.score = { ...this.score };

    // Add the last goal information if available
    if (this.lastGoal) {
      state.lastGoal = { ...this.lastGoal };
    }

    return state;
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

  getScore() {
    return { ...this.score };
  }

  getLastGoal() {
    return this.lastGoal;
  }

  resetBall() {
    this.world.resetBall();
  }

  scoreGoal(team: 1 | 2) {
    if (team === 1) {
      this.score.team1 += 1;
    } else {
      this.score.team2 += 1;
    }

    this.lastGoal = { team, time: Date.now() };

    // Reset ball position after a goal
    setTimeout(() => {
      this.resetBall();
    }, 1500);
  }

  private setupGoalDetection() {
    // Set up collision detection for goals
    this.world.onBallCollision((wallName: string) => {
      // Check if the ball hit the back of a goal net
      if (wallName === "backNetBack") {
        this.scoreGoal(2); // Team 2 scores when ball hits back net of team 1
      } else if (wallName === "frontNetBack") {
        this.scoreGoal(1); // Team 1 scores when ball hits back net of team 2
      }
    });
  }
}
