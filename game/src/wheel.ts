export const WHEEL = {
  radius: 0.5,
  directionLocal: [0, -1, 0] as [number, number, number],
  axleLocal: [1, 0, 0] as [number, number, number],
  suspensionStiffness: 30,
  suspensionRestLength: 0.3,
  frictionSlip: 5,
  dampingRelaxation: 2.3,
  dampingCompression: 4.4,
  maxSuspensionForce: 100000,
  rollInfluence: 0.01,
  maxSuspensionTravel: 0.3,
  customSlidingRotationalSpeed: -30,
  useCustomSlidingRotationalSpeed: true,
  chassisConnectionPointLocal: [0, 0, 0] as [number, number, number],
} as const;

export type WheelConfig = typeof WHEEL & {
  isFrontWheel: boolean;
};

export function createWheelConfig(isFrontWheel: boolean): WheelConfig {
  return {
    ...WHEEL,
    isFrontWheel,
  };
}

export function createWheelBodyConfig() {
  return {
    collisionFilterGroup: 0,
    mass: 1,
    material: "wheel",
    shapes: [
      {
        args: [WHEEL.radius, WHEEL.radius, 0.5, 16],
        rotation: [0, 0, -Math.PI / 2],
        type: "Cylinder" as const,
      },
    ],
    type: "Kinematic" as const,
  };
}
