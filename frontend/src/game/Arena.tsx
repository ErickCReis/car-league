import { useRef } from "react";
import type { Mesh, Group } from "three";

// Arena component that creates the basic game environment
export function Arena() {
  // References for potential animation or physics interactions
  const floorRef = useRef<Mesh>(null);
  const wallsRef = useRef<Group>(null);

  // Arena dimensions
  const arenaWidth = 40;
  const arenaLength = 80;
  const arenaHeight = 20;
  const wallThickness = 1;

  return (
    <group>
      {/* Floor/field */}
      <mesh
        ref={floorRef}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0, 0]}
        receiveShadow
      >
        <planeGeometry args={[arenaWidth, arenaLength]} />
        <meshStandardMaterial
          color="#3b7d3b"
          roughness={0.8}
        />
      </mesh>

      {/* Center line */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0.01, 0]}
      >
        <planeGeometry args={[arenaWidth * 0.01, arenaLength]} />
        <meshStandardMaterial color="white" />
      </mesh>

      {/* Center circle */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0.01, 0]}
      >
        <ringGeometry args={[5, 5.2, 32]} />
        <meshStandardMaterial color="white" />
      </mesh>

      {/* Walls group */}
      <group ref={wallsRef}>
        {/* Back wall (blue goal side) */}
        <mesh position={[0, arenaHeight / 2, arenaLength / 2 + wallThickness / 2]} castShadow receiveShadow>
          <boxGeometry args={[arenaWidth + wallThickness * 2, arenaHeight, wallThickness]} />
          <meshStandardMaterial color="#555555" roughness={0.5} />
        </mesh>

        {/* Front wall (orange goal side) */}
        <mesh position={[0, arenaHeight / 2, -arenaLength / 2 - wallThickness / 2]} castShadow receiveShadow>
          <boxGeometry args={[arenaWidth + wallThickness * 2, arenaHeight, wallThickness]} />
          <meshStandardMaterial color="#555555" roughness={0.5} />
        </mesh>

        {/* Left wall */}
        <mesh position={[-arenaWidth / 2 - wallThickness / 2, arenaHeight / 2, 0]} castShadow receiveShadow>
          <boxGeometry args={[wallThickness, arenaHeight, arenaLength]} />
          <meshStandardMaterial color="#555555" roughness={0.5} />
        </mesh>

        {/* Right wall */}
        <mesh position={[arenaWidth / 2 + wallThickness / 2, arenaHeight / 2, 0]} castShadow receiveShadow>
          <boxGeometry args={[wallThickness, arenaHeight, arenaLength]} />
          <meshStandardMaterial color="#555555" roughness={0.5} />
        </mesh>
      </group>

      {/* Blue team goal */}
      <group position={[0, 0, arenaLength / 2 - 1]}>
        <mesh position={[0, 5, 0]} castShadow>
          <boxGeometry args={[10, 10, 2]} />
          <meshStandardMaterial color="#1a53ff" transparent opacity={0.3} />
        </mesh>
        {/* Goal posts */}
        <mesh position={[-5, 5, 0]} castShadow>
          <cylinderGeometry args={[0.5, 0.5, 10]} />
          <meshStandardMaterial color="#dddddd" />
        </mesh>
        <mesh position={[5, 5, 0]} castShadow>
          <cylinderGeometry args={[0.5, 0.5, 10]} />
          <meshStandardMaterial color="#dddddd" />
        </mesh>
        <mesh position={[0, 10, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.5, 0.5, 10]} />
          <meshStandardMaterial color="#dddddd" />
        </mesh>
      </group>

      {/* Orange team goal */}
      <group position={[0, 0, -arenaLength / 2 + 1]}>
        <mesh position={[0, 5, 0]} castShadow>
          <boxGeometry args={[10, 10, 2]} />
          <meshStandardMaterial color="#ff6600" transparent opacity={0.3} />
        </mesh>
        {/* Goal posts */}
        <mesh position={[-5, 5, 0]} castShadow>
          <cylinderGeometry args={[0.5, 0.5, 10]} />
          <meshStandardMaterial color="#dddddd" />
        </mesh>
        <mesh position={[5, 5, 0]} castShadow>
          <cylinderGeometry args={[0.5, 0.5, 10]} />
          <meshStandardMaterial color="#dddddd" />
        </mesh>
        <mesh position={[0, 10, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.5, 0.5, 10]} />
          <meshStandardMaterial color="#dddddd" />
        </mesh>
      </group>
    </group>
  );
}