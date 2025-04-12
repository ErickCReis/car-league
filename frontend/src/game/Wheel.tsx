import { useCompoundBody } from "@react-three/cannon";
import { createWheelBodyConfig, WHEEL } from "game";
import { forwardRef } from "react";
import type { Group } from "three";

export const Wheel = forwardRef<Group>((_, ref) => {
  useCompoundBody(() => createWheelBodyConfig(), ref);
  return (
    <group ref={ref}>
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[WHEEL.radius, WHEEL.radius, 0.2, 16]} />
        <meshStandardMaterial color="black" />
      </mesh>
    </group>
  );
});
