import { KeyboardControls } from "@react-three/drei";

// Define the control keys for the game
export enum Controls {
	forward = "forward",
	backward = "backward",
	left = "left",
	right = "right",
	boost = "boost",
	jump = "jump",
	cameraZoomIn = "cameraZoomIn",
	cameraZoomOut = "cameraZoomOut",
	cameraUp = "cameraUp",
	cameraDown = "cameraDown",
}

// Define the key mappings
export const keyboardMap = [
	{ name: Controls.forward, keys: ["ArrowUp", "KeyW"] },
	{ name: Controls.backward, keys: ["ArrowDown", "KeyS"] },
	{ name: Controls.left, keys: ["ArrowLeft", "KeyA"] },
	{ name: Controls.right, keys: ["ArrowRight", "KeyD"] },
	{ name: Controls.boost, keys: ["ShiftLeft", "ShiftRight"] },
	{ name: Controls.jump, keys: ["Space"] },
	{ name: Controls.cameraZoomIn, keys: ["KeyZ"] },
	{ name: Controls.cameraZoomOut, keys: ["KeyX"] },
	{ name: Controls.cameraUp, keys: ["KeyR"] },
	{ name: Controls.cameraDown, keys: ["KeyF"] },
];

// Export the KeyboardControls component for use in the app
export { KeyboardControls };
