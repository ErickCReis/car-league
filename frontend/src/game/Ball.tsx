import { useSphere } from "@react-three/cannon";
import { useFrame } from "@react-three/fiber";
import { useSelector } from "@xstate/store/react";
import { carStore } from "@/state/car";

export function Ball() {
  const ballState = useSelector(
    carStore,
    (state) => state.context.gameState?.ball,
  );

  const [ballRef, ballApi] = useSphere(() => ({
    mass: 2,
    position: [0, 5, 0],
    args: [2], // radius
    material: {
      friction: 0.5,
      restitution: 0.7, // bounciness
    },
    type: "Dynamic",
  }));

  // Update position from server
  useFrame(() => {
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
      <sphereGeometry args={[2, 32, 32]} />
      <meshStandardMaterial color="gray" />
    </mesh>
  );
}
