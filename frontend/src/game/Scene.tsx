import { Canvas } from "@react-three/fiber";
import { Suspense, useRef } from "react";
import type { Group } from "three";
import { Arena } from "./Arena";
import { Car } from "./Car";
import { KeyboardControlsWrapper } from "./Controls";
import { Environment } from "./Environment";
import { FollowCamera } from "./FollowCamera";
import { PhysicsWorld } from "./PhysicsWorld";

export function Scene() {
  const carRef = useRef<Group>(null);

  return (
    <KeyboardControlsWrapper>
      <Canvas>
        <Suspense fallback={null}>
          {/* Environment (lighting, sky, etc.) */}
          <Environment />

          {/* Physics world */}
          <PhysicsWorld>
            {/* Game arena */}
            <Arena />
            <Car ref={carRef} />
            {/* <Ball /> */}
          </PhysicsWorld>

          {/* Camera that follows the car */}
          <FollowCamera target={carRef} />
        </Suspense>
      </Canvas>
    </KeyboardControlsWrapper>
  );
}
