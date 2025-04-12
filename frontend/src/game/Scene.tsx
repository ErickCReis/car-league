import { Canvas } from "@react-three/fiber";
import { useSelector } from "@xstate/store/react";
import { WorldState } from "common";
import { Suspense } from "react";
import { carStore } from "@/state/car";
import { Arena } from "./Arena";
import { Ball } from "./Ball";
import { Car } from "./Car";
import { Environment } from "./Environment";
import { FollowCamera } from "./FollowCamera";
import { PhysicsWorld } from "./PhysicsWorld";

const playerId = carStore.getSnapshot().context.id;

const emptyCars = {} as WorldState["cars"];

export function Scene() {
  const carsState = useSelector(
    carStore,
    (state) => state.context.gameState?.cars || emptyCars,
  );

  return (
    <Canvas>
      <Suspense fallback={null}>
        {/* Environment (lighting, sky, etc.) */}
        <Environment />

        <PhysicsWorld>
          <Arena />

          <Ball />

          <Car key={playerId} withControls carState={carsState[playerId]} />

          {Object.keys(carsState).map((id) =>
            id !== playerId ? <Car key={id} carState={carsState[id]} /> : null,
          )}
        </PhysicsWorld>

        {/* Camera that follows the car */}
        <FollowCamera />
      </Suspense>
    </Canvas>
  );
}
