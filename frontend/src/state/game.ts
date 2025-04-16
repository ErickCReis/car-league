import { createStore } from "@xstate/store";
import type { Object3D, Object3DEventMap } from "three";
import { GAME } from "@/game/PhysicsWorld";

export const playerId = crypto.randomUUID();

export const carStore = createStore({
  context: {
    ref: null as Object3D<Object3DEventMap> | null,
  },
  on: {
    init: (context, event: { ref: Object3D<Object3DEventMap> }) => ({
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
    init: (context, event: { players: string[] }) => {
      for (const player of event.players) {
        GAME.addPlayer(player);
      }

      return {
        ...context,
        players: event.players,
      };
    },
    addPlayer: (context, event: { player: string }) => {
      GAME.addPlayer(event.player);

      return {
        ...context,
        players: context.players
          .filter((p) => p !== event.player)
          .concat(event.player),
      };
    },
    removePlayer: (context, event: { player: string }) => {
      GAME.removePlayer(event.player);

      return {
        ...context,
        players: context.players.filter((p) => p !== event.player),
      };
    },
  },
});
