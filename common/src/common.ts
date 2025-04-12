import { z } from "zod";

// Player controls schema
const controlsSchema = z.object({
  forward: z.boolean(),
  backward: z.boolean(),
  left: z.boolean(),
  right: z.boolean(),
  brake: z.boolean(),
  reset: z.boolean(),
});

// Client to server messages
export const clientToServerSchema = z.discriminatedUnion("type", [
  // Legacy message - will be deprecated
  z.object({
    type: z.literal("updatePosition"),
    id: z.string(),
    position: z.tuple([z.number(), z.number(), z.number()]),
  }),
  // New messages for server-side physics
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
}

// Server to client messages
export type ServerToClient =
  | {
      type: "gameCreated";
      gameId: string;
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
