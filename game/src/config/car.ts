import type { Triplet } from "../utils/types";
import { WHEEL } from "./wheel";

export const CHASSIS = {
  width: 2,
  height: 1,
  length: 4,
  mass: 150,
  material: {
    friction: 0.1,
    restitution: 0.5,
  },
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
  defaultPosition: [0, 3, 0] as Triplet,
  wheels: [
    {
      ...WHEEL,
      isFrontWheel: true,
      chassisConnectionPointLocal: [
        -CHASSIS.width / 2,
        -CHASSIS.height / 2 + WHEEL.radius / 2,
        CHASSIS.length / 2 - 0.8,
      ] as Triplet,
    },
    {
      ...WHEEL,
      isFrontWheel: true,
      chassisConnectionPointLocal: [
        CHASSIS.width / 2,
        -CHASSIS.height / 2 + WHEEL.radius / 2,
        CHASSIS.length / 2 - 0.8,
      ] as Triplet,
    },
    {
      ...WHEEL,
      isFrontWheel: false,
      chassisConnectionPointLocal: [
        -CHASSIS.width / 2,
        -CHASSIS.height / 2 + WHEEL.radius / 2,
        -CHASSIS.length / 2 + 0.8,
      ] as Triplet,
    },
    {
      ...WHEEL,
      isFrontWheel: false,
      chassisConnectionPointLocal: [
        CHASSIS.width / 2,
        -CHASSIS.height / 2 + WHEEL.radius / 2,
        -CHASSIS.length / 2 + 0.8,
      ] as Triplet,
    },
  ],
} as const;

export enum CONTROLS {
  forward = "forward",
  backward = "backward",
  left = "left",
  right = "right",
  brake = "brake",
  reset = "reset",
  jump = "jump",
}

export type PlayerControls = Record<keyof typeof CONTROLS, boolean>;

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
