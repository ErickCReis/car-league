import type { Triplet } from "../utils/types";

export const ARENA = {
  width: 80,
  length: 120,
  height: 15,
  wallThickness: 1,
  ground: {
    position: [0, 0, 0] as Triplet,
    rotation: [-Math.PI / 2, 0, 0] as Triplet,
    material: {
      friction: 1,
      restitution: 0.5,
    },
  },
  walls: {
    friction: 0,
    restitution: 0.8,
  },
} as const;

export const GOAL = {
  width: 14,
  height: 10,
  netDepth: 5,
} as const;

export function createArenaWallConfigs() {
  const { width, length, height, wallThickness } = ARENA;
  const { width: goalWidth, height: goalHeight, netDepth } = GOAL;

  // Calculate dimensions for the wall segments
  const sideWallWidth = (width - goalWidth) / 2;
  const topWallHeight = height - goalHeight;

  return {
    // Front wall segments (with goal opening)
    frontLeft: {
      position: [
        -width / 2 + sideWallWidth / 2,
        height / 2,
        -length / 2 - wallThickness / 2,
      ],
      dimensions: [sideWallWidth, height, wallThickness],
    },
    frontRight: {
      position: [
        width / 2 - sideWallWidth / 2,
        height / 2,
        -length / 2 - wallThickness / 2,
      ],
      dimensions: [sideWallWidth, height, wallThickness],
    },
    frontTop: {
      position: [
        0,
        height - topWallHeight / 2,
        -length / 2 - wallThickness / 2,
      ],
      dimensions: [goalWidth, topWallHeight, wallThickness],
    },

    // Back wall segments (with goal opening)
    backLeft: {
      position: [
        -width / 2 + sideWallWidth / 2,
        height / 2,
        length / 2 + wallThickness / 2,
      ],
      dimensions: [sideWallWidth, height, wallThickness],
    },
    backRight: {
      position: [
        width / 2 - sideWallWidth / 2,
        height / 2,
        length / 2 + wallThickness / 2,
      ],
      dimensions: [sideWallWidth, height, wallThickness],
    },
    backTop: {
      position: [0, height - topWallHeight / 2, length / 2 + wallThickness / 2],
      dimensions: [goalWidth, topWallHeight, wallThickness],
    },

    // Side walls remain the same
    left: {
      position: [-width / 2 - wallThickness / 2, height / 2, 0],
      dimensions: [wallThickness, height, length],
    },
    right: {
      position: [width / 2 + wallThickness / 2, height / 2, 0],
      dimensions: [wallThickness, height, length],
    },

    // Goal 1 (Back) Net walls
    backNetBack: {
      position: [0, goalHeight / 2, length / 2 + wallThickness / 2 + netDepth],
      dimensions: [goalWidth, goalHeight, wallThickness],
    },
    backNetLeft: {
      position: [
        -goalWidth / 2,
        goalHeight / 2,
        length / 2 + wallThickness / 2 + netDepth / 2,
      ],
      dimensions: [wallThickness, goalHeight, netDepth],
    },
    backNetRight: {
      position: [
        goalWidth / 2,
        goalHeight / 2,
        length / 2 + wallThickness / 2 + netDepth / 2,
      ],
      dimensions: [wallThickness, goalHeight, netDepth],
    },
    backNetTop: {
      position: [0, goalHeight, length / 2 + wallThickness / 2 + netDepth / 2],
      dimensions: [goalWidth, wallThickness, netDepth],
    },

    // Goal 2 (Front) Net walls
    frontNetBack: {
      position: [0, goalHeight / 2, -length / 2 - wallThickness / 2 - netDepth],
      dimensions: [goalWidth, goalHeight, wallThickness],
    },
    frontNetLeft: {
      position: [
        -goalWidth / 2,
        goalHeight / 2,
        -length / 2 - wallThickness / 2 - netDepth / 2,
      ],
      dimensions: [wallThickness, goalHeight, netDepth],
    },
    frontNetRight: {
      position: [
        goalWidth / 2,
        goalHeight / 2,
        -length / 2 - wallThickness / 2 - netDepth / 2,
      ],
      dimensions: [wallThickness, goalHeight, netDepth],
    },
    frontNetTop: {
      position: [0, goalHeight, -length / 2 - wallThickness / 2 - netDepth / 2],
      dimensions: [goalWidth, wallThickness, netDepth],
    },

    // Ceiling
    ceiling: {
      position: [0, height + wallThickness / 2, 0],
      dimensions: [width, wallThickness, length],
    },
  } satisfies Record<string, { position: Triplet; dimensions: Triplet }>;
}
