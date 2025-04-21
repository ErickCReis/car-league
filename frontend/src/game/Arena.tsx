import { ARENA, createArenaWallConfigs, GOAL } from "game";

const { width: arenaWidth, length: arenaLength, wallThickness } = ARENA;
const { width: goalWidth, height: goalHeight } = GOAL;

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
        {/* Back wall segments */}
        <mesh position={wallConfigs.backLeft.position} castShadow receiveShadow>
          <boxGeometry args={wallConfigs.backLeft.dimensions} />
          <meshStandardMaterial
            color="#555555"
            roughness={0.5}
            transparent
            opacity={0.1}
          />
        </mesh>
        <mesh
          position={wallConfigs.backRight.position}
          castShadow
          receiveShadow
        >
          <boxGeometry args={wallConfigs.backRight.dimensions} />
          <meshStandardMaterial
            color="#555555"
            roughness={0.5}
            transparent
            opacity={0.1}
          />
        </mesh>
        <mesh position={wallConfigs.backTop.position} castShadow receiveShadow>
          <boxGeometry args={wallConfigs.backTop.dimensions} />
          <meshStandardMaterial
            color="#555555"
            roughness={0.5}
            transparent
            opacity={0.1}
          />
        </mesh>

        {/* Front wall segments */}
        <mesh
          position={wallConfigs.frontLeft.position}
          castShadow
          receiveShadow
        >
          <boxGeometry args={wallConfigs.frontLeft.dimensions} />
          <meshStandardMaterial
            color="#555555"
            roughness={0.5}
            transparent
            opacity={0.1}
          />
        </mesh>
        <mesh
          position={wallConfigs.frontRight.position}
          castShadow
          receiveShadow
        >
          <boxGeometry args={wallConfigs.frontRight.dimensions} />
          <meshStandardMaterial
            color="#555555"
            roughness={0.5}
            transparent
            opacity={0.1}
          />
        </mesh>
        <mesh position={wallConfigs.frontTop.position} castShadow receiveShadow>
          <boxGeometry args={wallConfigs.frontTop.dimensions} />
          <meshStandardMaterial
            color="#555555"
            roughness={0.5}
            transparent
            opacity={0.1}
          />
        </mesh>

        {/* Side walls */}
        <mesh position={wallConfigs.left.position} castShadow receiveShadow>
          <boxGeometry args={wallConfigs.left.dimensions} />
          <meshStandardMaterial
            color="#555555"
            roughness={0.5}
            transparent
            opacity={0.1}
          />
        </mesh>
        <mesh position={wallConfigs.right.position} castShadow receiveShadow>
          <boxGeometry args={wallConfigs.right.dimensions} />
          <meshStandardMaterial
            color="#555555"
            roughness={0.5}
            transparent
            opacity={0.1}
          />
        </mesh>

        {/* Ceiling */}
        <mesh position={wallConfigs.ceiling.position} receiveShadow>
          <boxGeometry args={wallConfigs.ceiling.dimensions} />
          <meshStandardMaterial
            color="#333333"
            roughness={0.7}
            transparent
            opacity={0.1}
            wireframe={true}
          />
        </mesh>

        {/* Ceiling solid backing */}
        <mesh
          position={[0, wallConfigs.ceiling.position[1] + 0.1, 0]}
          receiveShadow
        >
          <boxGeometry
            args={[
              wallConfigs.ceiling.dimensions[0] - 1,
              0.1,
              wallConfigs.ceiling.dimensions[2] - 1,
            ]}
          />
          <meshStandardMaterial
            color="#222222"
            roughness={0.8}
            transparent
            opacity={0.05}
          />
        </mesh>
      </group>

      {/* Goal 1 - Back with Net */}
      <group>
        {/* Goal area */}
        <mesh
          position={[0, goalHeight / 2, arenaLength / 2 + wallThickness / 2]}
          castShadow
        >
          <boxGeometry args={[goalWidth, goalHeight, 1]} />
          <meshStandardMaterial color="#1a53ff" transparent opacity={0.3} />
        </mesh>

        {/* Net back wall */}
        <mesh position={wallConfigs.backNetBack.position} castShadow>
          <boxGeometry args={wallConfigs.backNetBack.dimensions} />
          <meshStandardMaterial color="#dddddd" transparent opacity={0.2} />
        </mesh>

        {/* Net left wall */}
        <mesh position={wallConfigs.backNetLeft.position} castShadow>
          <boxGeometry args={wallConfigs.backNetLeft.dimensions} />
          <meshStandardMaterial color="#dddddd" transparent opacity={0.2} />
        </mesh>

        {/* Net right wall */}
        <mesh position={wallConfigs.backNetRight.position} castShadow>
          <boxGeometry args={wallConfigs.backNetRight.dimensions} />
          <meshStandardMaterial color="#dddddd" transparent opacity={0.2} />
        </mesh>

        {/* Net top wall */}
        <mesh position={wallConfigs.backNetTop.position} castShadow>
          <boxGeometry args={wallConfigs.backNetTop.dimensions} />
          <meshStandardMaterial color="#dddddd" transparent opacity={0.2} />
        </mesh>
      </group>

      {/* Goal 2 - Front with Net */}
      <group>
        {/* Goal area */}
        <mesh
          position={[0, goalHeight / 2, -arenaLength / 2 - wallThickness / 2]}
          castShadow
        >
          <boxGeometry args={[goalWidth, goalHeight, 1]} />
          <meshStandardMaterial color="#ff6600" transparent opacity={0.3} />
        </mesh>

        {/* Net back wall */}
        <mesh position={wallConfigs.frontNetBack.position} castShadow>
          <boxGeometry args={wallConfigs.frontNetBack.dimensions} />
          <meshStandardMaterial color="#dddddd" transparent opacity={0.2} />
        </mesh>

        {/* Net left wall */}
        <mesh position={wallConfigs.frontNetLeft.position} castShadow>
          <boxGeometry args={wallConfigs.frontNetLeft.dimensions} />
          <meshStandardMaterial color="#dddddd" transparent opacity={0.2} />
        </mesh>

        {/* Net right wall */}
        <mesh position={wallConfigs.frontNetRight.position} castShadow>
          <boxGeometry args={wallConfigs.frontNetRight.dimensions} />
          <meshStandardMaterial color="#dddddd" transparent opacity={0.2} />
        </mesh>

        {/* Net top wall */}
        <mesh position={wallConfigs.frontNetTop.position} castShadow>
          <boxGeometry args={wallConfigs.frontNetTop.dimensions} />
          <meshStandardMaterial color="#dddddd" transparent opacity={0.2} />
        </mesh>
      </group>
    </group>
  );
}
