import { useBox, useRaycastVehicle } from "@react-three/cannon";
import { useKeyboardControls } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import {
  CHASSIS,
  calculateBrakeValue,
  calculateEngineForce,
  calculateSteeringValue,
  createWheelConfigs,
  type PlayerControls,
} from "game";
import { useEffect, useRef } from "react";
import type { Group } from "three";
import { carStore, gameState } from "@/state/game";
import { Wheel } from "./Wheel";

export function Car(props: { id: string; withControls?: boolean }) {
  const wheelRefs = [
    useRef<Group>(null),
    useRef<Group>(null),
    useRef<Group>(null),
    useRef<Group>(null),
  ];

  const [chassisRef, chassisApi] = useBox(() => ({
    allowSleep: false,
    angularVelocity: [0, 0.5, 0],
    args: [CHASSIS.width, CHASSIS.height, CHASSIS.length],
    mass: CHASSIS.mass,
    position: gameState.cars[props.id]?.position ?? [0, 2, 0],
    type: props.withControls ? "Dynamic" : "Static",
  }));

  const [vehicleRef, vehicleApi] = useRaycastVehicle<Group>(() => ({
    chassisBody: chassisRef,
    wheels: wheelRefs,
    wheelInfos: createWheelConfigs(),
    indexForwardAxis: 2,
    indexRightAxis: 0,
    indexUpAxis: 1,
  }));

  const [, getKeys] = useKeyboardControls();

  useEffect(() => {
    if (!props.withControls) return;
    carStore.trigger.init({ ref: chassisRef });
  }, [props.withControls, chassisRef]);

  useFrame(() => {
    const carState = gameState.cars[props.id];
    if (carState) {
      const position = carState.position;
      chassisApi.position.set(position[0], position[1], position[2]);
      const quaternion = carState.quaternion;
      chassisApi.quaternion.set(
        quaternion[0],
        quaternion[1],
        quaternion[2],
        quaternion[3],
      );
    }

    if (!props.withControls) {
      return;
    }

    const controls = getKeys() as PlayerControls;

    const engineForce = calculateEngineForce(controls);
    const steeringValue = calculateSteeringValue(controls);
    const brakeValue = calculateBrakeValue(controls);

    vehicleApi.applyEngineForce(engineForce, 2);
    vehicleApi.applyEngineForce(engineForce, 3);

    vehicleApi.setSteeringValue(steeringValue, 0);
    vehicleApi.setSteeringValue(steeringValue, 1);

    vehicleApi.setBrake(brakeValue, 0);
    vehicleApi.setBrake(brakeValue, 1);
    vehicleApi.setBrake(brakeValue, 2);
    vehicleApi.setBrake(brakeValue, 3);

    if (controls.reset) {
      chassisApi.position.set(0, 2, 0);
      chassisApi.velocity.set(0, 0, 0);
      chassisApi.angularVelocity.set(0, 0, 0);
      chassisApi.rotation.set(0, 0, 0);
    }
  });

  return (
    <group ref={vehicleRef}>
      <mesh ref={chassisRef}>
        <boxGeometry args={[CHASSIS.width, CHASSIS.height, CHASSIS.length]} />
        <meshStandardMaterial color="orange" />
      </mesh>
      <Wheel ref={wheelRefs[0]} />
      <Wheel ref={wheelRefs[1]} />
      <Wheel ref={wheelRefs[2]} />
      <Wheel ref={wheelRefs[3]} />
    </group>
  );
}
