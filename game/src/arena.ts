import type { Triple } from "./types";

export const ARENA = {
  width: 60,
  length: 120,
  height: 12,
  wallThickness: 1,
  ground: {
    friction: 0.5,
    restitution: 0.5,
  },
  walls: {
    friction: 0,
    restitution: 0.8,
  },
} as const;

export function createGroundConfig() {
  return {
    position: [0, 0, 0] as Triple,
    rotation: [-Math.PI / 2, 0, 0] as Triple,
    material: ARENA.ground,
  };
}

export function createArenaWallConfigs() {
  const { width, length, height, wallThickness } = ARENA;

  return {
    front: {
      position: [0, height / 2, -length / 2 - wallThickness / 2],
      dimensions: [width + wallThickness * 2, height, wallThickness],
      material: ARENA.walls,
    },
    back: {
      position: [0, height / 2, length / 2 + wallThickness / 2],
      dimensions: [width + wallThickness * 2, height, wallThickness],
      material: ARENA.walls,
    },
    left: {
      position: [-width / 2 - wallThickness / 2, height / 2, 0],
      dimensions: [wallThickness, height, length],
      material: ARENA.walls,
    },
    right: {
      position: [width / 2 + wallThickness / 2, height / 2, 0],
      dimensions: [wallThickness, height, length],
      material: ARENA.walls,
    },
  } satisfies Record<
    string,
    { position: Triple; dimensions: Triple; material: typeof ARENA.walls }
  >;
}
