import { createWheelConfig, WHEEL } from "./wheel";

export const CHASSIS = {
  width: 2,
  height: 1,
  length: 4,
  mass: 150,
} as const;

export const CAR = {
  controls: {
    maxSteer: 0.5,
    maxForce: 500,
    brakeForce: 10,
  },
  vehicle: {
    indexForwardAxis: 2,
    indexRightAxis: 0,
    indexUpAxis: 1,
  },
  defaultPosition: [0, 2, 0] as [number, number, number],
  wheelPositions: [
    [
      -CHASSIS.width / 2,
      -CHASSIS.height / 2 + WHEEL.radius / 2,
      CHASSIS.length / 2 - 0.8,
    ],
    [
      CHASSIS.width / 2,
      -CHASSIS.height / 2 + WHEEL.radius / 2,
      CHASSIS.length / 2 - 0.8,
    ],
    [
      -CHASSIS.width / 2,
      -CHASSIS.height / 2 + WHEEL.radius / 2,
      -CHASSIS.length / 2 + 0.8,
    ],
    [
      CHASSIS.width / 2,
      -CHASSIS.height / 2 + WHEEL.radius / 2,
      -CHASSIS.length / 2 + 0.8,
    ],
  ] as [number, number, number][],
  resetState: {
    velocity: [0, 0, 0] as [number, number, number],
    angularVelocity: [0, 0, 0] as [number, number, number],
    quaternion: [0, 0, 0, 1] as [number, number, number, number],
  },
} as const;

export const CONTROLS = {
  forward: "forward",
  backward: "backward",
  left: "left",
  right: "right",
  brake: "brake",
  reset: "reset",
  jump: "jump",
} as const;

export type PlayerControls = Record<keyof typeof CONTROLS, boolean>;

export interface CarState {
  position: [number, number, number];
  quaternion: [number, number, number, number];
  velocity?: [number, number, number];
  angularVelocity?: [number, number, number];
}

export type CarConfig = {
  dimensions: [number, number, number];
  mass: number;
  position: [number, number, number];
  allowSleep: boolean;
};

export type VehicleConfig = typeof CAR.vehicle;

export function calculateEngineForce(controls: PlayerControls): number {
  return controls.forward
    ? -CAR.controls.maxForce
    : controls.backward
      ? CAR.controls.maxForce
      : 0;
}

export function calculateSteeringValue(controls: PlayerControls): number {
  return controls.left
    ? CAR.controls.maxSteer
    : controls.right
      ? -CAR.controls.maxSteer
      : 0;
}

export function calculateBrakeValue(controls: PlayerControls): number {
  return controls.brake ? CAR.controls.brakeForce : 0;
}

export function createCarChassisConfig(
  position: [number, number, number] = CAR.defaultPosition,
): CarConfig {
  return {
    dimensions: [CHASSIS.width, CHASSIS.height, CHASSIS.length],
    mass: CHASSIS.mass,
    position,
    allowSleep: false,
  };
}

export function createVehicleConfig(): VehicleConfig {
  return CAR.vehicle;
}

export function createWheelConfigs() {
  return CAR.wheelPositions.map((position, index) => ({
    ...createWheelConfig(index < 2),
    chassisConnectionPointLocal: position,
  }));
}

export type CarResetState = typeof CAR.resetState & {
  position: [number, number, number];
};

export function createCarResetState(
  position: [number, number, number] = CAR.defaultPosition,
): CarResetState {
  return {
    ...CAR.resetState,
    position,
  };
}
