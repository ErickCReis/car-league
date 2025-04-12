import { DurableObject } from "cloudflare:workers";
import {
  clientToServerSchema,
  type ServerToClient,
  type WorldState,
} from "common";
import { GameManager } from "./game/GameManager";

export class MyDurableObject extends DurableObject<Env> {
  private gameManager: GameManager;
  private socketPlayerMap: Map<WebSocket, string>;

  constructor(state: DurableObjectState, env: Env) {
    super(state, env);
    this.gameManager = new GameManager();
    this.socketPlayerMap = new Map();

    this.gameManager.registerUpdateCallback("main", (state) => {
      this.broadcastGameState(state);
    });
  }

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

    const data = parsed.data;

    switch (data.type) {
      case "joinGame": {
        const playerId = data.playerId;

        this.socketPlayerMap.set(thisWs, playerId);
        this.gameManager.addPlayerToGame(playerId);

        const joinMessage = JSON.stringify({
          type: "playerJoined",
          playerId: playerId,
        } satisfies ServerToClient);

        this.broadcastToAll(joinMessage);

        const players = this.gameManager.getGamePlayers();
        const playersMessage = JSON.stringify({
          type: "playersList",
          players: players,
        } satisfies ServerToClient);

        thisWs.send(playersMessage);
        break;
      }

      case "leaveGame": {
        const playerId = data.playerId;
        this.handlePlayerLeave(playerId);
        break;
      }

      case "controlsUpdate": {
        this.gameManager.applyPlayerControls(data.playerId, data.controls);
        break;
      }
    }
  }

  async webSocketClose(ws: WebSocket) {
    const playerId = this.socketPlayerMap.get(ws);
    if (playerId) {
      this.handlePlayerLeave(playerId);
    }

    this.socketPlayerMap.delete(ws);
  }

  private handlePlayerLeave(playerId: string) {
    this.gameManager.removePlayerFromCurrentGame(playerId);

    const leaveMessage = JSON.stringify({
      type: "playerLeft",
      playerId: playerId,
    } satisfies ServerToClient);

    this.broadcastToAll(leaveMessage);
  }

  private broadcastGameState(state: WorldState) {
    const stateMessage = JSON.stringify({
      type: "physicsUpdate",
      gameState: state,
    } satisfies ServerToClient);

    this.broadcastToAll(stateMessage);
  }

  private broadcastToAll(message: string) {
    for (const ws of this.ctx.getWebSockets()) {
      ws.send(message);
    }
  }
}
