import type { Triplet } from "../utils/types";

export const BALL = {
  mass: 2,
  radius: 2.5,
  material: {
    friction: 0.5,
    restitution: 0.7,
  },
  defaultPosition: [0, 5, 0] as Triplet,
} as const;
