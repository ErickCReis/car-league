import { Billboard, Text } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { CHASSIS } from "game";
import { useEffect, useRef } from "react";
import type { Group } from "three";
import { usePlayerName } from "@/state/player";
import { useGame } from "./GameProvider";
import { Wheel } from "./Wheel";

export function Car(props: { id: string }) {
  const { game, carRef } = useGame();
  const playerName = usePlayerName();
  const withControls = props.id === playerName;

  const vehicleRef = useRef<Group>(null);
  const chassisRef = useRef<Group>(null);
  const textRef = useRef<Group>(null);
  const wheelRefs = [
    useRef<Group>(null),
    useRef<Group>(null),
    useRef<Group>(null),
    useRef<Group>(null),
  ];

  useEffect(() => {
    if (!withControls || !chassisRef.current) return;
    carRef.current = chassisRef.current;
  }, [withControls, carRef]);

  useFrame(() => {
    const carState = game.world.cars.get(props.id);
    if (!carState) return;

    chassisRef.current?.position.copy(carState.chassisBody.position);
    chassisRef.current?.quaternion.copy(carState.chassisBody.quaternion);

    if (textRef.current && chassisRef.current) {
      textRef.current.position.x = chassisRef.current.position.x;
      textRef.current.position.y =
        chassisRef.current.position.y + CHASSIS.height + 0.5;
      textRef.current.position.z = chassisRef.current.position.z;
    }

    wheelRefs.forEach((wheelRef, i) => {
      carState.updateWheelTransform(i);
      const transform = carState.wheelInfos[i].worldTransform;
      wheelRef.current?.position.copy(transform.position);
      wheelRef.current?.quaternion.copy(transform.quaternion);
    });
  });

  return (
    <group ref={vehicleRef}>
      <mesh ref={chassisRef}>
        <boxGeometry args={[CHASSIS.width, CHASSIS.height, CHASSIS.length]} />
        <meshStandardMaterial color="orange" />
      </mesh>
      <Billboard ref={textRef}>
        <Text fontSize={0.5} outlineWidth={0.03} outlineColor="black">
          {props.id}
        </Text>
      </Billboard>
      <Wheel ref={wheelRefs[0]} />
      <Wheel ref={wheelRefs[1]} />
      <Wheel ref={wheelRefs[2]} />
      <Wheel ref={wheelRefs[3]} />
    </group>
  );
}
