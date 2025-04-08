import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Arena } from "./Arena";
import { Environment } from "./Environment";
import { Suspense } from "react";

export function Scene() {
	return (
		<Canvas shadows>
			<Suspense fallback={null}>
				{/* Camera setup with initial position */}
				<PerspectiveCamera
					makeDefault
					position={[0, 30, 40]}
					fov={50}
				/>

				{/* Environment (lighting, sky, etc.) */}
				<Environment />

				{/* Game arena */}
				<Arena />

				{/* Controls for development/debugging */}
				<OrbitControls target={[0, 0, 0]} maxPolarAngle={Math.PI / 2 - 0.1} />
			</Suspense>
		</Canvas>
	);
}
