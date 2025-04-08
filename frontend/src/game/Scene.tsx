import { Canvas, useFrame } from "@react-three/fiber";
import { Suspense } from "react";
import { Arena } from "./Arena";
import { Ball, useBallStore } from "./Ball";
import { CameraController } from "./CameraController";
import { Car, useCarStore } from "./Car";
import { KeyboardControlsWrapper } from "./Controls";
import { Environment } from "./Environment";
import { Vector3 } from "three";

export function Scene() {
	return (
		<KeyboardControlsWrapper>
			<Canvas shadows>
				<Suspense fallback={null}>
					<CameraController />

					{/* Environment (lighting, sky, etc.) */}
					<Environment />

					{/* Game arena */}
					<Arena />
					<Car />
					<Ball />
				</Suspense>
			</Canvas>
		</KeyboardControlsWrapper>
	);
}
