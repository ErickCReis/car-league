import { useFrame } from "@react-three/fiber";
import { BALL } from "game";
import { useRef } from "react";
import type { Mesh } from "three";
import { useGame } from "./GameProvider";

export function Ball() {
  const { game } = useGame();
  const ballRef = useRef<Mesh>(null);

  useFrame(() => {
    if (!ballRef.current) return;

    const ballState = game.world.ball;
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
