import { useSphere } from "@react-three/cannon";
import type { Mesh } from "three";

export function Ball() {
  const [ref, api] = useSphere(() => ({
    mass: 1,
    position: [0, 0.5, 0],
    args: [0.5], // radius
    material: {
      friction: 0.3,
      restitution: 0.7, // bounciness
    },
  }));

  return (
    <mesh ref={ref as React.RefObject<Mesh>} castShadow receiveShadow>
      <sphereGeometry args={[0.5, 32, 32]} />
      <meshStandardMaterial color="white" roughness={0.2} metalness={0.8} />
    </mesh>
  );
}
