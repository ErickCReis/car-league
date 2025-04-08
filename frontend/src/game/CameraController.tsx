import { useThree } from "@react-three/fiber";
import { useFrame } from "@react-three/fiber";
import { Vector3 } from "three";
import { useCarStore } from "./Car";

export function CameraController() {
	const { camera } = useThree();
	const { position, rotation } = useCarStore();

	// Camera follow settings
	const cameraOffset = new Vector3(0, 10, 20); // Height and distance behind car
	const smoothFactor = 0.1; // Lower = smoother camera movement

	useFrame(() => {
		// Calculate target camera position behind the car
		const targetPosition = position
			.clone()
			.add(
				new Vector3(
					Math.sin(rotation) * cameraOffset.z,
					cameraOffset.y,
					Math.cos(rotation) * cameraOffset.z,
				),
			);

		// Smoothly interpolate camera position
		camera.position.lerp(targetPosition, smoothFactor);

		// Make camera look at the car
		camera.lookAt(position);
	});

	return null;
}
