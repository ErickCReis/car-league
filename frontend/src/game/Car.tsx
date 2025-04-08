import { useKeyboardControls } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import { type Group, Vector3 } from "three";
import { create } from "zustand";
import { useBallStore } from "./Ball";

type CarState = {
	position: Vector3;
	velocity: Vector3;
	rotation: number;
	setPosition: (position: Vector3) => void;
	setVelocity: (velocity: Vector3) => void;
	setRotation: (rotation: number) => void;
};

export const useCarStore = create<CarState>((set) => ({
	position: new Vector3(0, 0, 0),
	velocity: new Vector3(0, 0, 0),
	rotation: 0,
	setPosition: (position) => set({ position }),
	setVelocity: (velocity) => set({ velocity }),
	setRotation: (rotation) => set({ rotation }),
}));

export function Car() {
	const carRef = useRef<Group>(null);
	const {
		position,
		velocity,
		rotation,
		setPosition,
		setVelocity,
		setRotation,
	} = useCarStore();

	// Define movement constants
	const ACCELERATION = 0.05;
	const MAX_SPEED = 0.5;
	const FRICTION = 0.9;
	const TURN_SPEED = 0.05;

	// Setup keyboard controls
	const [subscribeKeys, getKeys] = useKeyboardControls();

	useFrame(() => {
		const { forward, backward, left, right } = getKeys();

		// Update velocity based on input
		if (forward) {
			velocity.z -= Math.cos(rotation) * ACCELERATION;
			velocity.x -= Math.sin(rotation) * ACCELERATION;
		}
		if (backward) {
			velocity.z += Math.cos(rotation) * ACCELERATION;
			velocity.x += Math.sin(rotation) * ACCELERATION;
		}

		// Apply turning
		if (left) setRotation(rotation + TURN_SPEED);
		if (right) setRotation(rotation - TURN_SPEED);

		// Apply friction
		velocity.multiplyScalar(FRICTION);

		// Limit speed
		const speed = velocity.length();
		if (speed > MAX_SPEED) {
			velocity.multiplyScalar(MAX_SPEED / speed);
		}

		// Update position
		position.add(velocity);
		setPosition(position);

		// Update car mesh
		if (carRef.current) {
			carRef.current.position.copy(position);
			carRef.current.rotation.y = rotation;
		}
	});

	const { position: carPosition } = useCarStore();
	const {
		position: ballPosition,
		velocity: ballVelocity,
		setVelocity: setBallVelocity,
	} = useBallStore();

	useFrame(() => {
		// Calculate distance between car and ball
		const distance = carPosition.distanceTo(ballPosition);

		// Collision detection (assuming car size is 2x1x4 and ball radius is 0.5)
		if (distance < 2.5) {
			// Calculate collision direction
			const direction = new Vector3()
				.subVectors(ballPosition, carPosition)
				.normalize();

			// Apply force to ball based on collision
			const force = 0.2;
			setBallVelocity(
				new Vector3(
					direction.x * force,
					Math.abs(direction.y) * force,
					direction.z * force,
				),
			);
		}
	});

	return (
		<group ref={carRef}>
			{/* Temporary car mesh - replace with actual car model later */}
			<mesh>
				<boxGeometry args={[2, 1, 4]} />
				<meshStandardMaterial color="blue" />
			</mesh>
		</group>
	);
}
