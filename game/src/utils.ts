import * as CANNON from "cannon-es";

export type Duple = [number, number];
export type Triplet = [number, number, number];
export type Quad = [number, number, number, number];

export function toVec3(vec: Triplet) {
  return new CANNON.Vec3(...vec);
}

export function toQuat(vec: Quad) {
  return new CANNON.Quaternion(...vec);
}
