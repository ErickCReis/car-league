import { KeyboardControls } from "@react-three/drei";

export enum Controls {
	forward = "forward",
	backward = "backward",
	left = "left",
	right = "right",
	jump = "jump",
}

export const keyboardMap = [
	{ name: Controls.forward, keys: ["ArrowUp", "KeyW"] },
	{ name: Controls.backward, keys: ["ArrowDown", "KeyS"] },
	{ name: Controls.left, keys: ["ArrowLeft", "KeyA"] },
	{ name: Controls.right, keys: ["ArrowRight", "KeyD"] },
	{ name: Controls.jump, keys: ["Space"] },
];

export function KeyboardControlsWrapper({
	children,
}: { children: React.ReactNode }) {
	return <KeyboardControls map={keyboardMap}>{children}</KeyboardControls>;
}
