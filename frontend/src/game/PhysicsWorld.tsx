import { Physics } from "@react-three/cannon";
import type { ReactNode } from "react";

type PhysicsWorldProps = {
  children: ReactNode;
};

// This component wraps the entire game scene with a physics world
export function PhysicsWorld({ children }: PhysicsWorldProps) {
  return (
    <Physics
      gravity={[0, -30, 0]} // Stronger gravity for more arcade-like feel
      defaultContactMaterial={{
        friction: 0.3,
        restitution: 0.5, // Moderate bounciness
      }}
      allowSleep={true} // Improves performance by allowing objects to sleep when not moving
      iterations={10} // More iterations for better stability
      size={50} // Larger physics world size
    >
      {children}
    </Physics>
  );
}
