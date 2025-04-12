import * as CANNON from "cannon-es";
import type { WorldState } from "common";
import type { PlayerControls } from "game";
import {
  BALL,
  CAR,
  CHASSIS,
  calculateBrakeValue,
  calculateEngineForce,
  calculateSteeringValue,
  createArenaWallConfigs,
  createBallConfig,
  createGroundConfig,
  createWheelConfigs,
  WORLD,
} from "game";

const wheelConfigs = createWheelConfigs().map((config) => ({
  ...config,
  directionLocal: new CANNON.Vec3(...config.directionLocal),
  axleLocal: new CANNON.Vec3(...config.axleLocal),
  chassisConnectionPointLocal: new CANNON.Vec3(
    ...config.chassisConnectionPointLocal,
  ),
}));

const wheelOptions = wheelConfigs[0];

export class PhysicsWorld {
  private world: CANNON.World;
  private cars: Map<
    string,
    {
      vehicle: CANNON.RaycastVehicle;
      chassisBody: CANNON.Body;
    }
  >;
  private ball: CANNON.Body;
  private arena: {
    ground: CANNON.Body;
    walls: CANNON.Body[];
  };

  constructor() {
    this.world = new CANNON.World({
      allowSleep: WORLD.allowSleep,
      gravity: new CANNON.Vec3(...WORLD.gravity),
    });
    this.world.defaultContactMaterial.friction =
      WORLD.defaultContactMaterial.friction;
    this.world.defaultContactMaterial.restitution =
      WORLD.defaultContactMaterial.restitution;

    this.cars = new Map();

    this.arena = this.createArena();

    this.ball = this.createBall();
  }

  update(deltaTime: number): void {
    this.world.step(1 / 60, deltaTime, 10);
  }

  private createArena() {
    const groundConfig = createGroundConfig();
    const groundShape = new CANNON.Plane();
    const ground = new CANNON.Body({
      mass: 0,
      material: new CANNON.Material({
        friction: groundConfig.material.friction,
        restitution: groundConfig.material.restitution,
      }),
    });
    ground.addShape(groundShape);
    ground.quaternion.setFromAxisAngle(
      new CANNON.Vec3(1, 0, 0),
      groundConfig.rotation[0],
    );
    ground.position.set(...groundConfig.position);
    this.world.addBody(ground);

    // Create walls using shared wall configs
    const walls: CANNON.Body[] = [];
    const wallConfigs = createArenaWallConfigs();

    // Create each wall from the shared configs
    Object.values(wallConfigs).forEach((wallConfig) => {
      const wall = new CANNON.Body({
        mass: 0,
        material: new CANNON.Material({
          friction: wallConfig.material.friction,
          restitution: wallConfig.material.restitution,
        }),
      });

      wall.addShape(
        new CANNON.Box(
          new CANNON.Vec3(
            wallConfig.dimensions[0] / 2,
            wallConfig.dimensions[1] / 2,
            wallConfig.dimensions[2] / 2,
          ),
        ),
      );

      wall.position.set(...wallConfig.position);
      this.world.addBody(wall);
      walls.push(wall);
    });

    return { ground, walls };
  }

  // Create the ball using shared ball configuration
  private createBall() {
    const ballConfig = createBallConfig();
    const ball = new CANNON.Body({
      mass: ballConfig.mass,
      material: new CANNON.Material(BALL.material),
      shape: new CANNON.Sphere(BALL.radius),
      position: new CANNON.Vec3(...ballConfig.position),
      allowSleep: false,
    });

    this.world.addBody(ball);
    return ball;
  }

  // Create a car with physics using RaycastVehicle
  createCar(id: string, position: [number, number, number] = [0, 2, 0]) {
    // Create the chassis body
    const chassisShape = new CANNON.Box(
      new CANNON.Vec3(
        CHASSIS.width / 2,
        CHASSIS.height / 2,
        CHASSIS.length / 2,
      ),
    );
    const chassisBody = new CANNON.Body({
      mass: CHASSIS.mass,
      material: new CANNON.Material(),
      position: new CANNON.Vec3(...position),
      allowSleep: false,
    });
    chassisBody.addShape(chassisShape);
    this.world.addBody(chassisBody);

    // Create the vehicle
    const vehicle = new CANNON.RaycastVehicle({
      chassisBody,
      indexForwardAxis: 2, // z-axis is forward (matches frontend)
      indexRightAxis: 0, // x-axis is right (matches frontend)
      indexUpAxis: 1, // y-axis is up (matches frontend)
    });

    // Add wheels to the vehicle
    for (let i = 0; i < 4; i++) {
      const [x, y, z] = CAR.wheelPositions[i];
      const isFrontWheel = i < 2; // First two wheels are front wheels

      // Create wheel options for this wheel
      const wheelInfo = {
        ...wheelOptions,
        chassisConnectionPointLocal: new CANNON.Vec3(x, y, z),
        isFrontWheel,
      };

      vehicle.addWheel(wheelInfo);
    }

    // Add the vehicle to the world
    vehicle.addToWorld(this.world);

    // Store the car
    this.cars.set(id, { vehicle, chassisBody });

    return id;
  }

  // Remove a car from the simulation
  removeCar(id: string) {
    const car = this.cars.get(id);
    if (!car) return;

    // Remove the vehicle from the world
    car.vehicle.removeFromWorld(this.world);

    // Remove the chassis body
    this.world.removeBody(car.chassisBody);

    // Remove from map
    this.cars.delete(id);
  }

  // Apply controls to a car using RaycastVehicle API
  applyCarControls(id: string, controls: PlayerControls) {
    const car = this.cars.get(id);
    if (!car) return;

    const { vehicle, chassisBody } = car;

    // Use shared utility functions to calculate values
    const engineForce = calculateEngineForce(controls);
    const steeringValue = calculateSteeringValue(controls);
    const brakeValue = calculateBrakeValue(controls);

    // Apply engine force to back wheels (2 and 3)
    vehicle.applyEngineForce(engineForce, 2);
    vehicle.applyEngineForce(engineForce, 3);

    // Apply steering to front wheels (0 and 1)
    vehicle.setSteeringValue(steeringValue, 0);
    vehicle.setSteeringValue(steeringValue, 1);

    // Apply brakes to all wheels
    for (let i = 0; i < 4; i++) {
      vehicle.setBrake(brakeValue, i);
    }

    // Reset car position if requested
    if (controls.reset) {
      chassisBody.position.set(0, 2, 0);
      chassisBody.velocity.set(0, 0, 0);
      chassisBody.angularVelocity.set(0, 0, 0);
      chassisBody.quaternion.set(0, 0, 0, 1);
    }
  }

  // Get the current state of all objects for sending to clients
  getWorldState(): WorldState {
    const carStates: Record<
      string,
      {
        position: [number, number, number];
        quaternion: [number, number, number, number];
      }
    > = {};

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

    // Get ball state
    const ballState = {
      position: [
        this.ball.position.x,
        this.ball.position.y,
        this.ball.position.z,
      ] as [number, number, number],
      quaternion: [
        this.ball.quaternion.x,
        this.ball.quaternion.y,
        this.ball.quaternion.z,
        this.ball.quaternion.w,
      ] as [number, number, number, number],
    };

    return {
      cars: carStates,
      ball: ballState,
    };
  }
}
