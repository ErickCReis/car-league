import { create } from "zustand";

type GameState = {
  isPlaying: boolean;
  score: {
    blue: number;
    orange: number;
  };
  boostAmount: number;
  setIsPlaying: (isPlaying: boolean) => void;
  incrementScore: (team: "blue" | "orange") => void;
  resetScore: () => void;
  setBoostAmount: (amount: number) => void;
};

export const useGameStore = create<GameState>((set) => ({
  isPlaying: false,
  score: {
    blue: 0,
    orange: 0,
  },
  boostAmount: 100,
  setIsPlaying: (isPlaying) => set({ isPlaying }),
  incrementScore: (team) =>
    set((state) => ({
      score: {
        ...state.score,
        [team]: state.score[team] + 1,
      },
    })),
  resetScore: () => set({ score: { blue: 0, orange: 0 } }),
  setBoostAmount: (amount) => set({ boostAmount: amount }),
}));
