import { useKeyboardControls } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { CHASSIS, type PlayerControls } from "game";
import { useEffect, useRef } from "react";
import type { Group } from "three";
import { carStore } from "@/state/game";
import { GAME } from "./PhysicsWorld";
import { Wheel } from "./Wheel";

export function Car(props: { id: string; withControls?: boolean }) {
  const vehicleRef = useRef<Group>(null);
  const chassisRef = useRef<Group>(null);
  const wheelRefs = [
    useRef<Group>(null),
    useRef<Group>(null),
    useRef<Group>(null),
    useRef<Group>(null),
  ];

  const [, getKeys] = useKeyboardControls();

  useEffect(() => {
    if (!props.withControls || !chassisRef.current) return;
    carStore.trigger.init({ ref: chassisRef.current });
  }, [props.withControls]);

  useFrame(() => {
    const carState = GAME.physicsWorld.cars.get(props.id);
    if (!carState) return;

    chassisRef.current?.position.copy(carState.chassisBody.position);
    chassisRef.current?.quaternion.copy(carState.chassisBody.quaternion);
    wheelRefs.forEach((wheelRef, i) => {
      carState.updateWheelTransform(i);
      const transform = carState.wheelInfos[i].worldTransform;
      wheelRef.current?.position.copy(transform.position);
      wheelRef.current?.quaternion.copy(transform.quaternion);
    });

    if (!props.withControls) {
      return;
    }

    const controls = getKeys() as PlayerControls;
    GAME.physicsWorld.applyCarControls(props.id, controls);
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
