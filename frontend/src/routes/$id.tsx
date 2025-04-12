import { useKeyboardControls } from "@react-three/drei";
import { createFileRoute, Link } from "@tanstack/react-router";
import type { ClientToServer, ServerToClient } from "common";
import { WebSocket as RWS } from "partysocket";
import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Scene } from "@/game/Scene";
import { carStore } from "@/state/car";

export const Route = createFileRoute("/$id")({
  component: RouteComponent,
});

const playerId = carStore.getSnapshot().context.id;

function RouteComponent() {
  const { id: gameId } = Route.useParams();

  // Get keyboard controls
  const [, getKeys] = useKeyboardControls();

  const ws = useRef<RWS>(null);
  const controlsInterval = useRef<number | null>(null);

  useEffect(() => {
    // Connect to WebSocket
    ws.current = new RWS(
      import.meta.env.VITE_API_URL.replace("http", "ws") + "/ws/" + gameId,
    );

    // Handle incoming messages
    ws.current.addEventListener("message", (event) => {
      const msg = JSON.parse(event.data) as ServerToClient;

      switch (msg.type) {
        // Handle new message types
        case "gameCreated":
          console.log(`Game created: ${msg.gameId}`);
          break;

        case "playerJoined":
          console.log(`Player joined: ${msg.playerId}`);
          break;

        case "playerLeft":
          console.log(`Player left: ${msg.playerId}`);
          break;

        case "physicsUpdate":
          carStore.trigger.syncGameState({ gameState: msg.gameState });
          break;
      }
    });

    // Send join game message when component mounts
    const joinMsg = {
      type: "joinGame",
      playerId: playerId,
    } satisfies ClientToServer;

    ws.current.addEventListener("open", () => {
      ws.current?.send(JSON.stringify(joinMsg));
    });

    if (ws.current.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify(joinMsg));
    }

    // Set up interval to send control updates
    controlsInterval.current = setInterval(() => {
      if (!ws.current || ws.current.readyState !== WebSocket.OPEN) return;

      // Get current keyboard state
      const { forward, backward, left, right, brake, reset } = getKeys();

      // Send controls update
      const controlsMsg = {
        type: "controlsUpdate",
        playerId: playerId,
        controls: {
          forward,
          backward,
          left,
          right,
          brake,
          reset,
        },
      } satisfies ClientToServer;

      ws.current.send(JSON.stringify(controlsMsg));
    }, 1000 / 30) as unknown as number; // 30 updates per second

    // Cleanup function
    return () => {
      // Send leave game message
      if (ws.current && ws.current.readyState === WebSocket.OPEN) {
        const leaveMsg = {
          type: "leaveGame",
          playerId: playerId,
        } satisfies ClientToServer;
        ws.current.send(JSON.stringify(leaveMsg));
      }

      // Clear interval and close connection
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
