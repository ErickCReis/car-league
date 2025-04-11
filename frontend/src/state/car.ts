import { createStore } from "@xstate/store";
import { RefObject } from "react";
import { Group, Object3DEventMap } from "three";

export const carStore = createStore({
  context: {
    id: crypto.randomUUID(),
    ref: null as RefObject<Group<Object3DEventMap> | null> | null,
    position: [0, 2, 0] as [number, number, number],
    others: {} as Record<string, [number, number, number]>,
  },
  on: {
    init: (
      context,
      event: { ref: RefObject<Group<Object3DEventMap> | null> },
    ) => ({
      ...context,
      ref: event.ref,
    }),
    carMove: (context, event: { newPosition: [number, number, number] }) => ({
      ...context,
      position: event.newPosition,
    }),
    syncCar: (
      context,
      event: { id: string; position: [number, number, number] },
    ) => ({
      ...context,
      others: {
        ...context.others,
        [event.id]: event.position,
      },
    }),
  },
});
