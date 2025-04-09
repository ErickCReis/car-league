import { useSphere } from "@react-three/cannon";
import type { Mesh } from "three";

export function Ball() {
  const [ref] = useSphere(() => ({
    mass: 2,
    position: [0, 5, 0],
    args: [2], // radius
    material: {
      friction: 0.5,
      restitution: 0.7, // bounciness
    },
  }));

  return (
    <mesh ref={ref as React.RefObject<Mesh>} castShadow receiveShadow>
      <sphereGeometry args={[2, 32, 32]} />
      <meshStandardMaterial color="gray" />
    </mesh>
  );
}
