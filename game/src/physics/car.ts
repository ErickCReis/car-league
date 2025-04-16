import * as CANNON from "cannon-es";
import { CAR, CHASSIS } from "../config/car";
import { toVec3 } from "../utils";
import type { Triplet } from "../utils/types";

const wheelConfigs = CAR.wheels.map((config) => ({
  ...config,
  directionLocal: toVec3(config.directionLocal),
  axleLocal: toVec3(config.axleLocal),
  chassisConnectionPointLocal: toVec3(config.chassisConnectionPointLocal),
}));

export function createCar(position: Triplet = CAR.defaultPosition) {
  const chassisBody = new CANNON.Body({
    mass: CHASSIS.mass,
    material: new CANNON.Material(CHASSIS.material),
    position: toVec3(position),
    allowSleep: false,
    shape: new CANNON.Box(
      new CANNON.Vec3(
        CHASSIS.width / 2,
        CHASSIS.height / 2,
        CHASSIS.length / 2,
      ),
    ),
  });

  // Create the vehicle
  const vehicle = new CANNON.RaycastVehicle({
    ...CAR.vehicle,
    chassisBody,
  });

  // Add wheels to the vehicle
  for (const wheel of wheelConfigs) {
    vehicle.addWheel(wheel);
  }

  return vehicle;
}
