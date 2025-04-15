import * as CANNON from "cannon-es";
import { ARENA, createArenaWallConfigs } from "./config/arena";
import { toVec3 } from "./utils";

export function createArena() {
  const ground = new CANNON.Body({
    type: CANNON.Body.STATIC,
    material: new CANNON.Material(ARENA.ground.material),
    position: toVec3(ARENA.ground.position),
    shape: new CANNON.Plane(),
  });
  ground.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2);

  const wallConfigs = createArenaWallConfigs();
  const walls = Object.values(wallConfigs).map((wallConfig) => {
    return new CANNON.Body({
      type: CANNON.Body.STATIC,
      material: new CANNON.Material(ARENA.walls),
      shape: new CANNON.Box(
        toVec3([
          wallConfig.dimensions[0] / 2,
          wallConfig.dimensions[1] / 2,
          wallConfig.dimensions[2] / 2,
        ]),
      ),
      position: toVec3(wallConfig.position),
    });
  });

  return { ground, walls };
}
