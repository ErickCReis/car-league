import * as CANNON from "cannon-es";
import { BALL } from "../config/ball";
import { toVec3 } from "../utils";

export function createBall() {
  const ball = new CANNON.Body({
    mass: BALL.mass,
    material: new CANNON.Material(BALL.material),
    shape: new CANNON.Sphere(BALL.radius),
    position: toVec3(BALL.defaultPosition),
    allowSleep: false,
  });

  return ball;
}
