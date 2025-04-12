import { createStore } from "@xstate/store";
import { WorldState } from "common";
import { RefObject } from "react";
import { Object3D, Object3DEventMap } from "three";

export const carStore = createStore({
  context: {
    id: crypto.randomUUID(),
    ref: null as RefObject<Object3D<Object3DEventMap>> | null,
    gameState: null as WorldState | null,
  },
  on: {
    init: (context, event: { ref: RefObject<Object3D<Object3DEventMap>> }) => ({
      ...context,
      ref: event.ref,
    }),
    syncGameState: (context, event: { gameState: WorldState }) => ({
      ...context,
      gameState: event.gameState,
    }),
  },
});
