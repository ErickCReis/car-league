import * as CANNON from "cannon-es";
import type { Quad, Triplet } from "./types";

export function toVec3(vec: Triplet) {
  return new CANNON.Vec3(...vec);
}

export function toQuat(vec: Quad) {
  return new CANNON.Quaternion(...vec);
}
