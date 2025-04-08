import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import { type Mesh, Vector3 } from "three";
import { create } from "zustand";

type BallState = {
	position: Vector3;
	velocity: Vector3;
	setPosition: (position: Vector3) => void;
	setVelocity: (velocity: Vector3) => void;
};

export const useBallStore = create<BallState>((set) => ({
	position: new Vector3(0, 0.5, 0),
	velocity: new Vector3(0, 0, 0),
	setPosition: (position) => set({ position }),
	setVelocity: (velocity) => set({ velocity }),
}));

export function Ball() {
	const ballRef = useRef<Mesh>(null);
	const { position, velocity, setPosition } = useBallStore();

	// Update ball position each frame
	useFrame(() => {
		if (!ballRef.current) return;

		// Apply gravity
		velocity.y -= 0.01;

		// Check for floor collision (y=0 is ground level)
		if (position.y <= 0.5) {
			// Ball radius is 0.5
			position.y = 0.5; // Reset to ground level
			velocity.y *= -0.7; // Bounce with energy loss
			velocity.x *= 0.9; // Slow down horizontal movement on bounce
			velocity.z *= 0.9;
		}

		// Update position
		position.add(velocity);
		setPosition(position);

		// Update ball mesh
		ballRef.current.position.copy(position);
	});

	return (
		<mesh
			ref={ballRef}
			position={[0, 0.5, 0]} // Start slightly above ground
			castShadow
			receiveShadow
		>
			<sphereGeometry args={[0.5, 32, 32]} /> {/* Ball radius of 0.5 units */}
			<meshStandardMaterial color="white" roughness={0.2} metalness={0.8} />
		</mesh>
	);
}
