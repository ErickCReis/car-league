import { useSphere } from "@react-three/cannon";
import { useFrame } from "@react-three/fiber";
import { BALL, createBallConfig } from "game";
import { gameState } from "@/state/game";

export function Ball() {
  const [ballRef, ballApi] = useSphere(() => createBallConfig());

  useFrame(() => {
    const ballState = gameState?.ball;
    if (!ballState) return;

    const position = ballState.position;
    ballApi.position.set(position[0], position[1], position[2]);

    const quaternion = ballState.quaternion;
    ballApi.quaternion.set(
      quaternion[0],
      quaternion[1],
      quaternion[2],
      quaternion[3],
    );
  });

  return (
    <mesh ref={ballRef} castShadow receiveShadow>
      <sphereGeometry args={[BALL.radius, 32, 32]} />
      <meshStandardMaterial color="gray" />
    </mesh>
  );
}
