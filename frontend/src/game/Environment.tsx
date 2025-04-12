import { Environment as DreiEnvironment, Sky } from "@react-three/drei";

export function Environment() {
  return (
    <>
      <Sky
        distance={450000}
        sunPosition={[0, 1, 0]}
        inclination={0.6}
        azimuth={0.25}
      />

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

      <pointLight position={[-20, 10, -20]} intensity={0.3} />
      <pointLight position={[20, 10, 20]} intensity={0.3} />

      <DreiEnvironment preset="city" />

      <fog attach="fog" args={["#c9d5e0", 100, 200]} />
    </>
  );
}
