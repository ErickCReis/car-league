import { createStore } from "@xstate/store";
import type { WorldState } from "common";
import type { RefObject } from "react";
import type { Object3D, Object3DEventMap } from "three";

export const playerId = crypto.randomUUID();

export const carStore = createStore({
  context: {
    ref: null as RefObject<Object3D<Object3DEventMap>> | null,
  },
  on: {
    init: (context, event: { ref: RefObject<Object3D<Object3DEventMap>> }) => ({
      ...context,
      ref: event.ref,
    }),
  },
});

export const playersStore = createStore({
  context: {
    players: [playerId] as string[],
  },
  on: {
    init: (context, event: { players: string[] }) => ({
      ...context,
      players: event.players,
    }),
    addPlayer: (context, event: { player: string }) => ({
      ...context,
      players: context.players
        .filter((p) => p !== event.player)
        .concat(event.player),
    }),
    removePlayer: (context, event: { player: string }) => ({
      ...context,
      players: context.players.filter((p) => p !== event.player),
    }),
  },
});

export const gameState = {
  ball: null as WorldState["ball"] | null,
  cars: {} as WorldState["cars"],
};
