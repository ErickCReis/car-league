import type { Triplet } from "../utils/types";

export const WORLD = {
  gravity: [0, -10, 0] as Triplet,
  defaultContactMaterial: {
    friction: 0.3,
    restitution: 0.5,
  },
  allowSleep: true,
} as const;
