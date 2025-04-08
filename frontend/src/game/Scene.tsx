import { OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";

export function Scene() {
	return (
		<Canvas>
			<ambientLight intensity={0.5} />
			<directionalLight position={[10, 10, 5]} intensity={1} />
			<mesh>
				<boxGeometry args={[1, 1, 1]} />
				<meshStandardMaterial color="orange" />
			</mesh>
			<OrbitControls />
		</Canvas>
	);
}
