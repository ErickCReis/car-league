import type { Triplet } from "../utils/types";

export const WHEEL = {
  radius: 0.5,
  directionLocal: [0, -1, 0] as Triplet,
  axleLocal: [1, 0, 0] as Triplet,
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
  chassisConnectionPointLocal: [0, 0, 0] as Triplet,
} as const;
