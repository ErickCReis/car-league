import { Environment as DreiEnvironment, Sky } from "@react-three/drei";

// Environment component for lighting, sky, and atmosphere
export function Environment() {
	return (
		<>
			{/* Sky backdrop */}
			<Sky
				distance={450000}
				sunPosition={[0, 1, 0]}
				inclination={0.6}
				azimuth={0.25}
			/>

			{/* Main lighting */}
			<ambientLight intensity={0.4} />
			<directionalLight
				position={[10, 20, 10]}
				intensity={1.5}
				castShadow
				shadow-mapSize={[2048, 2048]}
				shadow-camera-left={-50}
				shadow-camera-right={50}
				shadow-camera-top={50}
				shadow-camera-bottom={-50}
				shadow-camera-near={0.1}
				shadow-camera-far={200}
			/>

			{/* Fill lights for better visibility */}
			<pointLight position={[-20, 10, -20]} intensity={0.3} />
			<pointLight position={[20, 10, 20]} intensity={0.3} />

			{/* Environment map for reflections */}
			<DreiEnvironment preset="city" />

			{/* Fog for depth perception */}
			<fog attach="fog" args={["#c9d5e0", 100, 200]} />
		</>
	);
}
