export const BALL = {
  mass: 2,
  radius: 2,
  material: {
    friction: 0.5,
    restitution: 0.7,
  },
  defaultPosition: [0, 5, 0] as [number, number, number],
} as const;

export type BallConfig = {
  mass: number;
  radius: number;
  position: [number, number, number];
  material: {
    friction: number;
    restitution: number;
  };
};

export function createBallConfig() {
  return {
    mass: BALL.mass,
    args: [BALL.radius] as [number],
    radius: BALL.radius,
    position: BALL.defaultPosition,
    material: BALL.material,
  };
}
