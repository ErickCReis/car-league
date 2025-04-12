import { KeyboardControls } from "@react-three/drei";
import { CONTROLS } from "game";

export const keyboardMap = [
  { name: CONTROLS.forward, keys: ["ArrowUp", "KeyW"] },
  { name: CONTROLS.backward, keys: ["ArrowDown", "KeyS"] },
  { name: CONTROLS.left, keys: ["ArrowLeft", "KeyA"] },
  { name: CONTROLS.right, keys: ["ArrowRight", "KeyD"] },
  { name: CONTROLS.brake, keys: ["Space"] },
  { name: CONTROLS.reset, keys: ["Backspace"] },
  { name: CONTROLS.jump, keys: ["KeyJ"] },
];

export function KeyboardControlsWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return <KeyboardControls map={keyboardMap}>{children}</KeyboardControls>;
}
