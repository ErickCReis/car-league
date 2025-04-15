import { useFrame } from "@react-three/fiber";
import { BALL } from "game";
import { useRef } from "react";
import type { Mesh } from "three";
import { GAME } from "./PhysicsWorld";

export function Ball() {
  const ballRef = useRef<Mesh>(null);

  useFrame(() => {
    if (!ballRef.current) return;

    const ballState = GAME.physicsWorld.ball;
    ballRef.current.position.copy(ballState.position);
    ballRef.current.quaternion.copy(ballState.quaternion);
  });

  return (
    <mesh ref={ballRef} castShadow receiveShadow>
      <sphereGeometry args={[BALL.radius, 32, 32]} />
      <meshStandardMaterial color="gray" />
    </mesh>
  );
}
