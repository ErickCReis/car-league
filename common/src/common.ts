import { z } from "zod";

const controlsSchema = z.object({
  forward: z.boolean(),
  backward: z.boolean(),
  left: z.boolean(),
  right: z.boolean(),
  brake: z.boolean(),
  reset: z.boolean(),
  jump: z.boolean(),
});

export const clientToServerSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("updatePosition"),
    id: z.string(),
    position: z.tuple([z.number(), z.number(), z.number()]),
  }),
  z.object({
    type: z.literal("joinGame"),
    playerId: z.string(),
  }),
  z.object({
    type: z.literal("leaveGame"),
    playerId: z.string(),
  }),
  z.object({
    type: z.literal("controlsUpdate"),
    playerId: z.string(),
    controls: controlsSchema,
  }),
]);

export type ClientToServer = z.infer<typeof clientToServerSchema>;

export interface WorldState {
  ball: {
    position: [number, number, number];
    quaternion: [number, number, number, number];
  };
  cars: Record<
    string,
    {
      position: [number, number, number];
      quaternion: [number, number, number, number];
    }
  >;
  score: {
    team1: number;
    team2: number;
  };
  lastGoal?: {
    team: 1 | 2;
    time: number;
  };
}

export type ServerToClient =
  | {
      type: "playersList";
      players: string[];
    }
  | {
      type: "playerJoined";
      playerId: string;
    }
  | {
      type: "playerLeft";
      playerId: string;
    }
  | {
      type: "physicsUpdate";
      gameState: WorldState;
    };
