import * as CANNON from "cannon-es";

// Wheel options - matching the frontend wheelInfo
const wheelOptions = {
  radius: 0.5,
  directionLocal: new CANNON.Vec3(0, -1, 0),
  suspensionStiffness: 30,
  suspensionRestLength: 0.3,
  frictionSlip: 5,
  dampingRelaxation: 2.3,
  dampingCompression: 4.4,
  maxSuspensionForce: 100000,
  rollInfluence: 0.01,
  axleLocal: new CANNON.Vec3(1, 0, 0),
  chassisConnectionPointLocal: new CANNON.Vec3(0, 0, 0),
  maxSuspensionTravel: 0.3,
  customSlidingRotationalSpeed: -30,
  useCustomSlidingRotationalSpeed: true,
  // isFrontWheel will be set per wheel when creating the vehicle
};

const chassisWidth = 2;
const chassisHeight = 1;
const chassisLength = 4;
const chassisMass = 150;

// Wheel positions
const wheelPositions = [
  [
    -chassisWidth / 2,
    -chassisHeight / 2 + wheelOptions.radius * 0.5,
    chassisLength / 2 - 0.8,
  ],
  [
    chassisWidth / 2,
    -chassisHeight / 2 + wheelOptions.radius * 0.5,
    chassisLength / 2 - 0.8,
  ],
  [
    -chassisWidth / 2,
    -chassisHeight / 2 + wheelOptions.radius * 0.5,
    -chassisLength / 2 + 0.8,
  ],
  [
    chassisWidth / 2,
    -chassisHeight / 2 + wheelOptions.radius * 0.5,
    -chassisLength / 2 + 0.8,
  ],
];

// This class manages the physics world on the server side
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
    // Initialize the physics world
    this.world = new CANNON.World();
    this.world.gravity.set(0, -10, 0);
    this.world.defaultContactMaterial.friction = 0.3;
    this.world.defaultContactMaterial.restitution = 0.5;
    this.world.allowSleep = true;

    // Initialize collections
    this.cars = new Map();

    // Create the arena
    this.arena = this.createArena();

    // Create the ball
    this.ball = this.createBall();
  }

  // Step the physics simulation forward
  update(deltaTime: number): void {
    this.world.step(1 / 60, deltaTime, 10);
  }

  // Create the arena with walls and ground
  private createArena() {
    const arenaWidth = 60;
    const arenaLength = 120;
    const arenaHeight = 12;
    const wallThickness = 1;

    // Ground
    const groundShape = new CANNON.Plane();
    const ground = new CANNON.Body({
      mass: 0, // static body
      material: new CANNON.Material({
        friction: 0.5,
        restitution: 0.5,
      }),
    });
    ground.addShape(groundShape);
    ground.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2);
    ground.position.set(0, 0, 0);
    this.world.addBody(ground);

    // Walls
    const walls: CANNON.Body[] = [];

    // Back wall
    const backWall = new CANNON.Body({
      mass: 0,
      material: new CANNON.Material({
        friction: 0,
        restitution: 0.8,
      }),
    });
    backWall.addShape(
      new CANNON.Box(
        new CANNON.Vec3(
          (arenaWidth + wallThickness * 2) / 2,
          arenaHeight / 2,
          wallThickness / 2,
        ),
      ),
    );
    backWall.position.set(
      0,
      arenaHeight / 2,
      arenaLength / 2 + wallThickness / 2,
    );
    this.world.addBody(backWall);
    walls.push(backWall);

    // Front wall
    const frontWall = new CANNON.Body({
      mass: 0,
      material: new CANNON.Material({
        friction: 0,
        restitution: 0.8,
      }),
    });
    frontWall.addShape(
      new CANNON.Box(
        new CANNON.Vec3(
          (arenaWidth + wallThickness * 2) / 2,
          arenaHeight / 2,
          wallThickness / 2,
        ),
      ),
    );
    frontWall.position.set(
      0,
      arenaHeight / 2,
      -arenaLength / 2 - wallThickness / 2,
    );
    this.world.addBody(frontWall);
    walls.push(frontWall);

    // Left wall
    const leftWall = new CANNON.Body({
      mass: 0,
      material: new CANNON.Material({
        friction: 0,
        restitution: 0.8,
      }),
    });
    leftWall.addShape(
      new CANNON.Box(
        new CANNON.Vec3(wallThickness / 2, arenaHeight / 2, arenaLength / 2),
      ),
    );
    leftWall.position.set(
      -arenaWidth / 2 - wallThickness / 2,
      arenaHeight / 2,
      0,
    );
    this.world.addBody(leftWall);
    walls.push(leftWall);

    // Right wall
    const rightWall = new CANNON.Body({
      mass: 0,
      material: new CANNON.Material({
        friction: 0,
        restitution: 0.8,
      }),
    });
    rightWall.addShape(
      new CANNON.Box(
        new CANNON.Vec3(wallThickness / 2, arenaHeight / 2, arenaLength / 2),
      ),
    );
    rightWall.position.set(
      arenaWidth / 2 + wallThickness / 2,
      arenaHeight / 2,
      0,
    );
    this.world.addBody(rightWall);
    walls.push(rightWall);

    return { ground, walls };
  }

  // Create the ball
  private createBall() {
    const ball = new CANNON.Body({
      mass: 2,
      material: new CANNON.Material({
        friction: 0.5,
        restitution: 0.7,
      }),
      shape: new CANNON.Sphere(2),
      position: new CANNON.Vec3(0, 5, 0),
      allowSleep: false,
    });

    this.world.addBody(ball);
    return ball;
  }

  // Create a car with physics using RaycastVehicle
  createCar(id: string, position: [number, number, number] = [0, 2, 0]) {
    // Create the chassis body
    const chassisShape = new CANNON.Box(
      new CANNON.Vec3(chassisWidth / 2, chassisHeight / 2, chassisLength / 2),
    );
    const chassisBody = new CANNON.Body({
      mass: chassisMass,
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
      const [x, y, z] = wheelPositions[i];
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
  applyCarControls(
    id: string,
    controls: {
      forward: boolean;
      backward: boolean;
      left: boolean;
      right: boolean;
      brake: boolean;
      reset: boolean;
    },
  ) {
    const car = this.cars.get(id);
    if (!car) return;

    const { vehicle, chassisBody } = car;

    // Constants for controls - matching frontend values
    const maxSteer = 0.5;
    const maxForce = 500;
    const brakeForce = 10;

    // Apply engine force
    const engineForce = controls.forward
      ? -maxForce
      : controls.backward
        ? maxForce
        : 0;

    // Apply steering
    const steeringValue = controls.left
      ? maxSteer
      : controls.right
        ? -maxSteer
        : 0;

    // Apply engine force to back wheels (2 and 3)
    vehicle.applyEngineForce(engineForce, 2);
    vehicle.applyEngineForce(engineForce, 3);

    // Apply steering to front wheels (0 and 1)
    vehicle.setSteeringValue(steeringValue, 0);
    vehicle.setSteeringValue(steeringValue, 1);

    // Apply brakes to all wheels
    const brakeValue = controls.brake ? brakeForce : 0;
    for (let i = 0; i < 4; i++) {
      vehicle.setBrake(brakeValue, i);
    }

    // Reset car position if requested
    if (controls.reset) {
      chassisBody.position.set(0, 2, 0);
      chassisBody.velocity.set(0, 0, 0);
      chassisBody.angularVelocity.set(0, 0, 0);
      chassisBody.quaternion.set(0, 0, 0, 1);

      // The vehicle will automatically update wheel positions in the next step
    }
  }

  // Get the current state of all objects for sending to clients
  getWorldState() {
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
