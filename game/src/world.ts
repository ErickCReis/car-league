import type { Triple } from "./types";

export const WORLD = {
  gravity: [0, -10, 0] as Triple,
  defaultContactMaterial: {
    friction: 0.3,
    restitution: 0.5,
  },
  allowSleep: true,
  iterations: 10,
  size: 50,
} as const;

export type WorldConfig = typeof WORLD;

export function createWorldConfig(): WorldConfig {
  return WORLD;
}
