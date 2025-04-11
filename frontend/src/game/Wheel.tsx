import { useCompoundBody, WheelInfoOptions } from "@react-three/cannon";
import { forwardRef } from "react";
import { Group } from "three";

export const wheelInfo = {
  radius: 0.5, // Wheel radius
  directionLocal: [0, -1, 0], // Explicit tuple
  axleLocal: [1, 0, 0], // Explicit tuple
  suspensionStiffness: 30,
  suspensionRestLength: 0.3,
  frictionSlip: 5, // Adjust for grip
  dampingRelaxation: 2.3,
  dampingCompression: 4.4,
  maxSuspensionForce: 100000,
  rollInfluence: 0.01,
  maxSuspensionTravel: 0.3,
  customSlidingRotationalSpeed: -30,
  useCustomSlidingRotationalSpeed: true,
} satisfies WheelInfoOptions;

export const Wheel = forwardRef<Group>((_, ref) => {
  useCompoundBody(
    () => ({
      collisionFilterGroup: 0,
      mass: 1,
      material: "wheel",
      shapes: [
        {
          args: [wheelInfo.radius, wheelInfo.radius, 0.5, 16],
          rotation: [0, 0, -Math.PI / 2],
          type: "Cylinder",
        },
      ],
      type: "Kinematic",
    }),
    ref,
  );
  return (
    <group ref={ref}>
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry
          args={[wheelInfo.radius, wheelInfo.radius, 0.2, 16]}
        />
        <meshStandardMaterial color="black" />
      </mesh>
    </group>
  );
});
