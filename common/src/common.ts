import { z } from "zod";

export const clientToServerSchema = z.object({
  type: z.literal("updatePosition"),
  id: z.string(),
  position: z.tuple([z.number(), z.number(), z.number()]),
});

export type ClientToServer = z.infer<typeof clientToServerSchema>;

export type ServerToClient = {
  type: "syncPosition";
  id: string;
  position: [number, number, number];
};
