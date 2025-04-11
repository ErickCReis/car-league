import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Scene } from "@/game/Scene";
import { useEffect, useRef, useState } from "react";
import { WebSocket as RWS } from "partysocket";
import type { ClientToServer, ServerToClient } from "common";
import { carStore } from "@/state/car";

export const Route = createFileRoute("/$id")({
  component: RouteComponent,
});

function RouteComponent() {
  const { id } = Route.useParams();

  const ws = useRef<RWS>(null);
  useEffect(() => {
    ws.current = new RWS(
      import.meta.env.VITE_API_URL.replace("http", "ws") + "/ws/" + id,
    );

    ws.current.addEventListener("message", (event) => {
      const msg = JSON.parse(event.data) as ServerToClient;

      if (msg.type === "syncPosition") {
        carStore.trigger.syncCar({
          id: msg.id,
          position: msg.position,
        });
      }
    });

    const carId = carStore.getSnapshot().context.id;
    const position = carStore.select((store) => store.position);
    position.subscribe((pos) => {
      const msg = {
        type: "updatePosition",
        id: carId,
        position: pos,
      } satisfies ClientToServer;

      ws.current?.send(JSON.stringify(msg));
    });

    return () => {
      ws.current?.close();
    };
  });

  return (
    <div className="flex flex-col h-screen w-full bg-background text-foreground">
      <div className="absolute top-0 left-0 right-0 z-10 p-4 flex flex-col gap-4">
        <div className="flex gap-2 justify-center">
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
