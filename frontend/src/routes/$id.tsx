import { useKeyboardControls } from "@react-three/drei";
import { createFileRoute, Link } from "@tanstack/react-router";
import type { ClientToServer, ServerToClient } from "common";
import type { PlayerControls } from "game";
import { WebSocket as RWS } from "partysocket";
import { useEffect, useRef } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { KeyboardControlsWrapper } from "@/game/Controls";
import { GAME } from "@/game/PhysicsWorld";
import { Scene } from "@/game/Scene";
import { playerId, playersStore } from "@/state/game";

export const Route = createFileRoute("/$id")({
  component: () => (
    <KeyboardControlsWrapper>
      <RouteComponent />
    </KeyboardControlsWrapper>
  ),
});

function RouteComponent() {
  const { id: gameId } = Route.useParams();

  const [, getKeys] = useKeyboardControls();

  const ws = useRef<RWS>(null);
  const controlsInterval = useRef<number | null>(null);

  useEffect(() => {
    ws.current = new RWS(
      import.meta.env.VITE_API_URL.replace("http", "ws") + "/ws/" + gameId,
    );

    ws.current.addEventListener("message", (event) => {
      const msg = JSON.parse(event.data) as ServerToClient;

      switch (msg.type) {
        case "playersList":
          playersStore.trigger.init({ players: msg.players });
          break;

        case "playerJoined":
          toast(`Player joined: ${msg.playerId}`);
          playersStore.trigger.addPlayer({ player: msg.playerId });
          break;

        case "playerLeft":
          toast(`Player left: ${msg.playerId}`);
          playersStore.trigger.removePlayer({ player: msg.playerId });
          break;

        case "physicsUpdate":
          GAME.physicsWorld.syncWorldState(msg.gameState);
          break;
      }
    });

    ws.current.addEventListener("open", () => {
      const joinMsg = {
        type: "joinGame",
        playerId,
      } satisfies ClientToServer;

      ws.current?.send(JSON.stringify(joinMsg));
    });

    controlsInterval.current = window.setInterval(() => {
      if (!ws.current || ws.current.readyState !== WebSocket.OPEN) return;

      const controls = getKeys() as PlayerControls;
      const controlsMsg = {
        type: "controlsUpdate",
        playerId: playerId,
        controls,
      } satisfies ClientToServer;

      ws.current.send(JSON.stringify(controlsMsg));
    }, 1000 / 30);

    return () => {
      if (ws.current && ws.current.readyState === WebSocket.OPEN) {
        const leaveMsg = {
          type: "leaveGame",
          playerId: playerId,
        } satisfies ClientToServer;
        ws.current.send(JSON.stringify(leaveMsg));
      }

      if (controlsInterval.current !== null) {
        clearInterval(controlsInterval.current);
      }
      ws.current?.close();
    };
  }, [gameId, getKeys]);

  return (
    <div className="flex flex-col h-screen w-full bg-background text-foreground">
      <div className="absolute top-0 left-0 right-0 z-10 p-4 flex flex-col gap-4">
        <div className="flex gap-2 justify-center">
          <div className="flex items-center gap-2">
            <span>{playerId}</span>
          </div>
          <Button variant="secondary" asChild>
            <Link to="/">Back to Menu</Link>
          </Button>
        </div>
      </div>
      <div className="flex-1 w-full">
        <Scene />
      </div>
    </div>
  );
}
