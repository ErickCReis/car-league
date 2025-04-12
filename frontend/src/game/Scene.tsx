import { Canvas } from "@react-three/fiber";
import { useSelector } from "@xstate/store/react";
import { Suspense } from "react";
import { playerId, playersStore } from "@/state/game";
import { Arena } from "./Arena";
import { Ball } from "./Ball";
import { Car } from "./Car";
import { Environment } from "./Environment";
import { FollowCamera } from "./FollowCamera";
import { PhysicsWorld } from "./PhysicsWorld";

export function Scene() {
  const players = useSelector(playersStore, (state) => state.context.players);

  return (
    <Canvas>
      <Suspense fallback={null}>
        <Environment />

        <PhysicsWorld>
          <Arena />

          <Ball />

          {players.map((id) => (
            <Car key={id} id={id} withControls={playerId === id} />
          ))}
        </PhysicsWorld>

        <FollowCamera />
      </Suspense>
    </Canvas>
  );
}
