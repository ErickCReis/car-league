import { DurableObject } from "cloudflare:workers";
import { clientToServerSchema, ServerToClient } from "common";

export class MyDurableObject extends DurableObject<Env> {
  async fetch() {
    const { 0: client, 1: server } = new WebSocketPair();

    this.ctx.acceptWebSocket(server);
    return new Response(null, {
      status: 101,
      webSocket: client,
    });
  }

  async webSocketMessage(thisWs: WebSocket, message: string | ArrayBuffer) {
    if (typeof message !== "string") return;
    const parsed = clientToServerSchema.safeParse(JSON.parse(message));
    if (!parsed.success) return;

    if (parsed.data.type === "updatePosition") {
      const message = JSON.stringify({
        type: "syncPosition",
        id: parsed.data.id,
        position: parsed.data.position,
      } satisfies ServerToClient);

      for (const ws of this.ctx.getWebSockets()) {
        if (ws === thisWs) continue;
        ws.send(message);
      }
      return;
    }
  }
}
