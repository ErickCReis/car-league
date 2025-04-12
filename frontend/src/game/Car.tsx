import { useBox, useRaycastVehicle } from "@react-three/cannon";
import { useKeyboardControls } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { WorldState } from "common";
import { useEffect, useRef } from "react";
import type { Group } from "three";
import { carStore } from "@/state/car";
import { Wheel, wheelInfo } from "./Wheel";

const chassisWidth = 2;
const chassisHeight = 1;
const chassisLength = 4;
const chassisMass = 150;

const wheelPositions = [
  [
    -chassisWidth / 2,
    -chassisHeight / 2 + wheelInfo.radius * 0.5,
    chassisLength / 2 - 0.8,
  ],
  [
    chassisWidth / 2,
    -chassisHeight / 2 + wheelInfo.radius * 0.5,
    chassisLength / 2 - 0.8,
  ],
  [
    -chassisWidth / 2,
    -chassisHeight / 2 + wheelInfo.radius * 0.5,
    -chassisLength / 2 + 0.8,
  ],
  [
    chassisWidth / 2,
    -chassisHeight / 2 + wheelInfo.radius * 0.5,
    -chassisLength / 2 + 0.8,
  ],
] as [number, number, number][];

export function Car(props: {
  withControls?: boolean;
  carState: WorldState["cars"][string];
}) {
  const carState = props.carState;

  const wheelRefs = [
    useRef<Group>(null),
    useRef<Group>(null),
    useRef<Group>(null),
    useRef<Group>(null),
  ];

  // Only use physics if not server-controlled
  const [chassisRef, chassisApi] = useBox(() => ({
    allowSleep: false,
    angularVelocity: [0, 0.5, 0],
    args: [chassisWidth, chassisHeight, chassisLength],
    mass: chassisMass,
    position: carState?.position ?? [0, 2, 0],
    type: props.withControls ? "Dynamic" : "Static", // Make static if server-controlled
  }));

  // Only create vehicle if not server-controlled
  const [vehicleRef, vehicleApi] = useRaycastVehicle<Group>(() => ({
    chassisBody: chassisRef,
    wheels: wheelRefs,
    wheelInfos: wheelPositions.map((pos) => ({
      ...wheelInfo,
      chassisConnectionPointLocal: pos,
      isFrontWheel: pos[2] > 0,
    })),
    indexForwardAxis: 2,
    indexRightAxis: 0,
    indexUpAxis: 1,
  }));

  const maxSteer = 0.5;
  const maxForce = 500;
  const brakeForce = 10;

  const [, getKeys] = useKeyboardControls();

  // Initialize car in store if this is the controlled car
  useEffect(() => {
    if (!props.withControls) return;
    carStore.trigger.init({ ref: chassisRef });
  }, [props.withControls, chassisRef]);

  // Update from server position if provided
  useFrame(() => {
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

    const { forward, backward, left, right, brake, reset } = getKeys();

    const engineForce = forward ? -maxForce : backward ? maxForce : 0;
    const steeringValue = left ? maxSteer : right ? -maxSteer : 0;

    vehicleApi.applyEngineForce(engineForce, 2);
    vehicleApi.applyEngineForce(engineForce, 3);

    vehicleApi.setSteeringValue(steeringValue, 0);
    vehicleApi.setSteeringValue(steeringValue, 1);

    const brakeValue = brake ? brakeForce : 0;
    vehicleApi.setBrake(brakeValue, 0);
    vehicleApi.setBrake(brakeValue, 1);
    vehicleApi.setBrake(brakeValue, 2);
    vehicleApi.setBrake(brakeValue, 3);

    if (reset) {
      chassisApi.position.set(0, 2, 0);
      chassisApi.velocity.set(0, 0, 0);
      chassisApi.angularVelocity.set(0, 0, 0);
      chassisApi.rotation.set(0, 0, 0);
    }
  });

  return (
    <group ref={vehicleRef}>
      <mesh ref={chassisRef}>
        <boxGeometry args={[chassisWidth, chassisHeight, chassisLength]} />
        <meshStandardMaterial color="orange" />
      </mesh>
      <Wheel ref={wheelRefs[0]} />
      <Wheel ref={wheelRefs[1]} />
      <Wheel ref={wheelRefs[2]} />
      <Wheel ref={wheelRefs[3]} />
    </group>
  );
}
