import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import { Arena } from "./Arena";
import { Ball } from "./Ball";
import { Car } from "./Car";
import { KeyboardControlsWrapper } from "./Controls";
import { Environment } from "./Environment";
import { FollowCamera } from "./FollowCamera";
import { PhysicsWorld } from "./PhysicsWorld";
import { useSelector } from "@xstate/store/react";
import { carStore } from "@/state/car";

export function Scene() {
  const others = useSelector(carStore, (state) => state.context.others);

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
            <Ball />

            <Car withControls position={[0, 2, 0]} />

            {Object.entries(others).map(([id, position]) => (
              <Car key={id} position={position} />
            ))}
          </PhysicsWorld>

          {/* Camera that follows the car */}
          <FollowCamera />
        </Suspense>
      </Canvas>
    </KeyboardControlsWrapper>
  );
}
