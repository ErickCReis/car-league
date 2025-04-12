import { Physics } from "@react-three/cannon";
import { WORLD } from "game";
import type { ReactNode } from "react";

type PhysicsWorldProps = {
  children: ReactNode;
};

export function PhysicsWorld({ children }: PhysicsWorldProps) {
  return (
    <Physics
      gravity={WORLD.gravity}
      defaultContactMaterial={WORLD.defaultContactMaterial}
      allowSleep={WORLD.allowSleep}
      iterations={WORLD.iterations}
      size={WORLD.size}
    >
      {children}
    </Physics>
  );
}
