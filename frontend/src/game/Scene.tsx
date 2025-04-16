import { Suspense } from "react";
import { Arena } from "./Arena";
import { Ball } from "./Ball";
import { Car } from "./Car";
import { Environment } from "./Environment";
import { FollowCamera } from "./FollowCamera";
import { useGame } from "./GameProvider";

export function Scene() {
  const { players } = useGame();

  return (
    <Suspense fallback={null}>
      <Environment />

      <Arena />

      <Ball />

      {players.map((id) => (
        <Car key={id} id={id} />
      ))}

      <FollowCamera />
    </Suspense>
  );
}
