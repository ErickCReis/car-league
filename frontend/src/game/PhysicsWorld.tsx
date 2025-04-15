import { useFrame } from "@react-three/fiber";
import { Game } from "game";
import type { ReactNode } from "react";
import { playerId } from "@/state/game";

type PhysicsWorldProps = {
  children: ReactNode;
};

export const GAME = new Game();
GAME.addPlayer(playerId);

export function PhysicsWorld({ children }: PhysicsWorldProps) {
  useFrame(() => {
    GAME.update();
  });

  return children;
}
