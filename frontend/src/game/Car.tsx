import {
  type WheelInfoOptions,
  useBox,
  useCompoundBody,
  useRaycastVehicle,
} from "@react-three/cannon";
import { useKeyboardControls } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { forwardRef, useRef } from "react";
import type { Group } from "three";

// Define wheel info properties (can be reused for all wheels)
const wheelInfo = {
  radius: 0.5, // Wheel radius
  directionLocal: [0, -1, 0], // Explicit tuple
  axleLocal: [1, 0, 0], // Explicit tuple
  suspensionStiffness: 30,
  suspensionRestLength: 0.3,
  frictionSlip: 5, // Adjust for grip
  dampingRelaxation: 2.3,
  dampingCompression: 4.4,
  maxSuspensionForce: 100000,
  rollInfluence: 0.01,
  maxSuspensionTravel: 0.3,
  customSlidingRotationalSpeed: -30,
  useCustomSlidingRotationalSpeed: true,
} satisfies WheelInfoOptions;

// Wheel component for visual representation
export const Wheel = forwardRef<Group>((_, ref) => {
  useCompoundBody(
    () => ({
      collisionFilterGroup: 0,
      mass: 1,
      material: "wheel",
      shapes: [
        {
          args: [wheelInfo.radius, wheelInfo.radius, 0.5, 16],
          rotation: [0, 0, -Math.PI / 2],
          type: "Cylinder",
        },
      ],
      type: "Kinematic",
    }),
    ref,
  );
  return (
    <group ref={ref}>
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry
          args={[wheelInfo.radius, wheelInfo.radius, 0.2, 16]}
        />
        <meshStandardMaterial color="black" />
      </mesh>
    </group>
  );
});

export const Car = forwardRef<Group>((_, ref) => {
  const chassisWidth = 2;
  const chassisHeight = 1;
  const chassisLength = 4;
  const chassisMass = 150;

  const wheelPositions = [
    [
      -chassisWidth / 2,
      -chassisHeight / 2 + wheelInfo.radius * 0.5,
      chassisLength / 2 - 0.8,
    ],
    [
      chassisWidth / 2,
      -chassisHeight / 2 + wheelInfo.radius * 0.5,
      chassisLength / 2 - 0.8,
    ],
    [
      -chassisWidth / 2,
      -chassisHeight / 2 + wheelInfo.radius * 0.5,
      -chassisLength / 2 + 0.8,
    ],
    [
      chassisWidth / 2,
      -chassisHeight / 2 + wheelInfo.radius * 0.5,
      -chassisLength / 2 + 0.8,
    ],
  ] as [number, number, number][];

  const wheelRefs = [
    useRef<Group>(null),
    useRef<Group>(null),
    useRef<Group>(null),
    useRef<Group>(null),
  ];

  const [chassisRef, chassisApi] = useBox(
    () => ({
      allowSleep: false,
      angularVelocity: [0, 0.5, 0],
      args: [chassisWidth, chassisHeight, chassisLength],
      mass: chassisMass,
      position: [0, 2, 0],
    }),
    ref,
  );

  const [vehicleRef, vehicleApi] = useRaycastVehicle<Group>(() => ({
    chassisBody: chassisRef,
    wheels: wheelRefs,
    wheelInfos: wheelPositions.map((pos) => ({
      ...wheelInfo,
      chassisConnectionPointLocal: pos,
      isFrontWheel: pos[2] > 0,
    })),
    indexForwardAxis: 2,
    indexRightAxis: 0,
    indexUpAxis: 1,
  }));

  const maxSteer = 0.5;
  const maxForce = 500;
  const brakeForce = 10;

  const [, getKeys] = useKeyboardControls();

  useFrame(() => {
    const { forward, backward, left, right, brake, reset } = getKeys();

    const engineForce = forward ? -maxForce : backward ? maxForce : 0;
    const steeringValue = left ? maxSteer : right ? -maxSteer : 0;

    vehicleApi.applyEngineForce(engineForce, 2);
    vehicleApi.applyEngineForce(engineForce, 3);

    vehicleApi.setSteeringValue(steeringValue, 0);
    vehicleApi.setSteeringValue(steeringValue, 1);

    const brakeValue = brake ? brakeForce : 0;
    vehicleApi.setBrake(brakeValue, 0);
    vehicleApi.setBrake(brakeValue, 1);
    vehicleApi.setBrake(brakeValue, 2);
    vehicleApi.setBrake(brakeValue, 3);

    if (reset) {
      chassisApi.position.set(0, 2, 0);
      chassisApi.velocity.set(0, 0, 0);
      chassisApi.angularVelocity.set(0, 0, 0);
      chassisApi.rotation.set(0, 0, 0);
    }
  });

  return (
    <group ref={vehicleRef}>
      <mesh ref={chassisRef}>
        <boxGeometry args={[chassisWidth, chassisHeight, chassisLength]} />
        <meshStandardMaterial color="orange" />
      </mesh>
      <Wheel ref={wheelRefs[0]} />
      <Wheel ref={wheelRefs[1]} />
      <Wheel ref={wheelRefs[2]} />
      <Wheel ref={wheelRefs[3]} />
    </group>
  );
});
