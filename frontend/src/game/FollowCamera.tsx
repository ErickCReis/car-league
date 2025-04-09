import { PerspectiveCamera } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { type RefObject, useRef } from "react";
import {
  type PerspectiveCamera as Cam,
  type Group,
  type Object3DEventMap,
  Quaternion,
  Vector3,
} from "three";

interface FollowCameraProps {
  target: RefObject<Group<Object3DEventMap> | null>;
}

const v = new Vector3();
const q = new Quaternion();

export function FollowCamera({ target }: FollowCameraProps) {
  const cameraRef = useRef<Cam>(null);
  const cameraPosition = useRef(new Vector3(0, 5, 10));
  const cameraTarget = useRef(new Vector3());

  useFrame((state, delta) => {
    if (!target.current || !cameraRef.current) return;

    // Get the car's position and rotation
    target.current.getWorldPosition(v);
    target.current.getWorldQuaternion(q);

    // Calculate the desired camera position (behind the car)
    const distance = 10; // Distance behind the car
    const height = 5; // Height above the car

    // Calculate the offset based on the car's rotation
    // Extract y rotation from quaternion
    const yRotation = Math.atan2(
      2 * (q.w * q.y + q.x * q.z),
      1 - 2 * (q.y * q.y + q.z * q.z)
    );

    const offsetX = -Math.sin(yRotation) * distance;
    const offsetZ = -Math.cos(yRotation) * distance;

    // Set the target position (slightly above the car)
    cameraTarget.current.set(v.x, v.y + 1, v.z);

    // Set the desired camera position
    const desiredPosition = new Vector3(
      v.x + offsetX,
      v.y + height,
      v.z + offsetZ
    );

    // Smoothly interpolate the camera position
    cameraPosition.current.lerp(desiredPosition, delta * 2);

    // Update the camera position
    cameraRef.current.position.copy(cameraPosition.current);

    // Make the camera look at the target
    cameraRef.current.lookAt(cameraTarget.current);
  });

  return (
    <PerspectiveCamera
      ref={cameraRef}
      makeDefault
      position={[0, 5, 10]}
      fov={75}
      near={0.1}
      far={1000}
    />
  );
}
