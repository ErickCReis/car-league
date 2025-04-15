import { ARENA, createArenaWallConfigs } from "game";

const { width: arenaWidth, length: arenaLength } = ARENA;

const wallConfigs = createArenaWallConfigs();

export function Arena() {
  return (
    <group>
      {/* Ground */}
      <mesh
        position={ARENA.ground.position}
        rotation={ARENA.ground.rotation}
        receiveShadow
      >
        <planeGeometry args={[arenaWidth, arenaLength]} />
        <meshStandardMaterial color="#3b7d3b" roughness={0.8} />
      </mesh>

      {/* Center line */}
      <mesh rotation={[-Math.PI / 2, 0, -Math.PI / 2]} position={[0, 0.01, 0]}>
        <planeGeometry args={[0.2, arenaWidth]} />
        <meshStandardMaterial color="white" />
      </mesh>

      {/* Center circle */}
      <mesh rotation={ARENA.ground.rotation} position={[0, 0.01, 0]}>
        <ringGeometry args={[5, 5.2, 32]} />
        <meshStandardMaterial color="white" />
      </mesh>

      <group>
        {/* Back wall */}
        <mesh position={wallConfigs.back.position} castShadow receiveShadow>
          <boxGeometry args={wallConfigs.back.dimensions} />
          <meshStandardMaterial
            color="#555555"
            roughness={0.5}
            transparent
            opacity={0.1}
          />
        </mesh>

        {/* Front wall */}
        <mesh position={wallConfigs.front.position} castShadow receiveShadow>
          <boxGeometry args={wallConfigs.front.dimensions} />
          <meshStandardMaterial
            color="#555555"
            roughness={0.5}
            transparent
            opacity={0.1}
          />
        </mesh>

        {/* Left wall */}
        <mesh position={wallConfigs.left.position} castShadow receiveShadow>
          <boxGeometry args={wallConfigs.left.dimensions} />
          <meshStandardMaterial
            color="#555555"
            roughness={0.5}
            transparent
            opacity={0.1}
          />
        </mesh>

        {/* Right wall */}
        <mesh position={wallConfigs.right.position} castShadow receiveShadow>
          <boxGeometry args={wallConfigs.right.dimensions} />
          <meshStandardMaterial
            color="#555555"
            roughness={0.5}
            transparent
            opacity={0.1}
          />
        </mesh>
      </group>

      {/* Goal 1 */}
      <group position={[0, 0, arenaLength / 2 - 1]}>
        <mesh position={[0, 5, 0]} castShadow>
          <boxGeometry args={[10, 10, 2]} />
          <meshStandardMaterial color="#1a53ff" transparent opacity={0.3} />
        </mesh>

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

      {/* Goal 2 */}
      <group position={[0, 0, -arenaLength / 2 + 1]}>
        <mesh position={[0, 5, 0]} castShadow>
          <boxGeometry args={[10, 10, 2]} />
          <meshStandardMaterial color="#ff6600" transparent opacity={0.3} />
        </mesh>

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
