import * as CANNON from "cannon-es";
import type { WorldState } from "common";
import { createArenaWallConfigs } from "./config/arena";
import { BALL } from "./config/ball";
import {
  calculateBrakeValue,
  calculateEngineForce,
  calculateSteeringValue,
  type PlayerControls,
} from "./config/car";
import { WORLD } from "./config/world";
import { createArena } from "./physics/arena";
import { createBall } from "./physics/ball";
import { createCar } from "./physics/car";
import { toQuat, toVec3 } from "./utils";

export class World {
  private world: CANNON.World;
  private ballCollisionCallbacks: Array<(wallName: string) => void> = [];
  private wallNameMap: Map<CANNON.Body, string> = new Map();

  arena: { ground: CANNON.Body; walls: CANNON.Body[] };
  ball: CANNON.Body;
  cars: Map<string, CANNON.RaycastVehicle>;

  constructor() {
    this.world = new CANNON.World({
      allowSleep: WORLD.allowSleep,
      gravity: toVec3(WORLD.gravity),
    });

    this.world.defaultContactMaterial.friction =
      WORLD.defaultContactMaterial.friction;
    this.world.defaultContactMaterial.restitution =
      WORLD.defaultContactMaterial.restitution;

    this.arena = createArena();
    this.world.addBody(this.arena.ground);

    // Map wall bodies to their names for collision detection
    const wallConfigs = createArenaWallConfigs();
    Object.entries(wallConfigs).forEach(([name], index) => {
      const wall = this.arena.walls[index];
      this.wallNameMap.set(wall, name);
    });

    this.arena.walls.forEach((wall) => this.world.addBody(wall));

    this.ball = createBall();
    this.world.addBody(this.ball);

    this.cars = new Map();

    // Set up collision detection
    this.setupCollisionDetection();
  }

  update(deltaTime: number): void {
    this.world.step(1 / 60, deltaTime, 10);
  }

  addCar(id: string) {
    const car = createCar();
    car.addToWorld(this.world);
    this.cars.set(id, car);
  }

  removeCar(id: string) {
    const car = this.cars.get(id);
    if (!car) return;

    car.removeFromWorld(this.world);
    this.cars.delete(id);
  }

  applyCarControls(id: string, controls: PlayerControls) {
    const car = this.cars.get(id);
    if (!car) return;

    // Use shared utility functions to calculate values
    const engineForce = calculateEngineForce(controls);
    const steeringValue = calculateSteeringValue(controls);
    const brakeValue = calculateBrakeValue(controls);

    // Apply engine force to back wheels (2 and 3)
    car.applyEngineForce(engineForce, 2);
    car.applyEngineForce(engineForce, 3);

    // Apply steering to front wheels (0 and 1)
    car.setSteeringValue(steeringValue, 0);
    car.setSteeringValue(steeringValue, 1);

    // Apply brakes to all wheels
    for (let i = 0; i < 4; i++) {
      car.setBrake(brakeValue, i);
    }

    // Reset car position if requested
    if (controls.reset) {
      car.chassisBody.position.set(0, 2, 0);
      car.chassisBody.velocity.set(0, 0, 0);
      car.chassisBody.angularVelocity.set(0, 0, 0);
      car.chassisBody.quaternion.set(0, 0, 0, 1);
    }
  }

  resetBall() {
    // Reset ball position and velocity
    this.ball.position.set(0, BALL.radius * 2, 0);
    this.ball.velocity.set(0, 0, 0);
    this.ball.angularVelocity.set(0, 0, 0);
    this.ball.quaternion.set(0, 0, 0, 1);
  }

  onBallCollision(callback: (wallName: string) => void) {
    this.ballCollisionCallbacks.push(callback);
  }

  private setupCollisionDetection() {
    // Set up collision detection for the ball
    this.ball.addEventListener("collide", (event: { body: CANNON.Body }) => {
      const { body } = event;

      // Check if the collision is with a wall
      if (this.arena.walls.includes(body)) {
        const wallName = this.wallNameMap.get(body);
        if (wallName) {
          // Notify all callbacks about the collision
          this.ballCollisionCallbacks.forEach((callback) => callback(wallName));
        }
      }
    });
  }

  getState(): WorldState {
    const carStates: WorldState["cars"] = {};

    // Get car states
    for (const [id, car] of this.cars.entries()) {
      carStates[id] = {
        position: [
          car.chassisBody.position.x,
          car.chassisBody.position.y,
          car.chassisBody.position.z,
        ],
        quaternion: [
          car.chassisBody.quaternion.x,
          car.chassisBody.quaternion.y,
          car.chassisBody.quaternion.z,
          car.chassisBody.quaternion.w,
        ],
      };
    }

    const ball = this.ball;

    // Create the world state including score
    return {
      cars: carStates,
      ball: {
        position: [ball.position.x, ball.position.y, ball.position.z],
        quaternion: [
          ball.quaternion.x,
          ball.quaternion.y,
          ball.quaternion.z,
          ball.quaternion.w,
        ],
      },
      score: { team1: 0, team2: 0 }, // This will be overridden by the Game class
    };
  }

  syncState(state: WorldState) {
    this.ball.position.copy(toVec3(state.ball.position));
    this.ball.quaternion.copy(toQuat(state.ball.quaternion));

    for (const [id, carState] of Object.entries(state.cars)) {
      const car = this.cars.get(id);
      if (!car) continue;

      car.chassisBody.position.copy(toVec3(carState.position));
      car.chassisBody.quaternion.copy(toQuat(carState.quaternion));
    }
  }
}
