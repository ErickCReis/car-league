import { createStore } from "@xstate/store";
import { useSelector } from "@xstate/store/react";

export const playerState = createStore({
  context: {
    playerName:
      localStorage.getItem("playerName") ||
      `Player_${Math.floor(Math.random() * 10000)}`,
  },
  on: {
    changePlayerName: (context, event: { name: string }) => {
      localStorage.setItem("playerName", event.name);
      return {
        ...context,
        playerName: event.name,
      };
    },
  },
});

export function usePlayerName() {
  return useSelector(playerState, (state) => state.context.playerName);
}
