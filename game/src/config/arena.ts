import type { Triplet } from "../utils/types";

export const ARENA = {
  width: 60,
  length: 120,
  height: 12,
  wallThickness: 1,
  ground: {
    position: [0, 0, 0] as Triplet,
    rotation: [-Math.PI / 2, 0, 0] as Triplet,
    material: {
      friction: 0.5,
      restitution: 0.5,
    },
  },
  walls: {
    friction: 0,
    restitution: 0.8,
  },
} as const;

export function createArenaWallConfigs() {
  const { width, length, height, wallThickness } = ARENA;

  return {
    front: {
      position: [0, height / 2, -length / 2 - wallThickness / 2],
      dimensions: [width + wallThickness * 2, height, wallThickness],
    },
    back: {
      position: [0, height / 2, length / 2 + wallThickness / 2],
      dimensions: [width + wallThickness * 2, height, wallThickness],
    },
    left: {
      position: [-width / 2 - wallThickness / 2, height / 2, 0],
      dimensions: [wallThickness, height, length],
    },
    right: {
      position: [width / 2 + wallThickness / 2, height / 2, 0],
      dimensions: [wallThickness, height, length],
    },
  } satisfies Record<string, { position: Triplet; dimensions: Triplet }>;
}
