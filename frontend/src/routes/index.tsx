import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { playerState, usePlayerName } from "@/state/player";

export const Route = createFileRoute("/")({
  component: Index,
});

export function Index() {
  const playerName = usePlayerName();
  const [roomId, setRoomId] = useState("shared");

  const handlePlayerNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value;
    playerState.trigger.changePlayerName({ name: newName });
  };

  const handleRoomIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newRoomId = e.target.value;
    setRoomId(newRoomId);
  };

  return (
    <div className="relative h-screen w-full overflow-hidden">
      <div className="absolute inset-0 z-10 bg-gradient-to-b from-background/70 to-background/90 backdrop-blur-sm" />

      <div className="absolute inset-0 z-20 flex flex-col items-center justify-center">
        <h1 className="mb-12 text-center text-6xl font-bold tracking-tight text-primary animate-fade-in">
          CAR LEAGUE
        </h1>

        <div className="flex flex-col gap-4 w-64 animate-fade-in animation-delay-400">
          <div className="space-y-2">
            <Label htmlFor="playerName">Player Name</Label>
            <Input
              id="playerName"
              value={playerName}
              onChange={handlePlayerNameChange}
              className="bg-background/80"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="roomId">Room ID</Label>
            <Input
              id="roomId"
              value={roomId}
              onChange={handleRoomIdChange}
              className="bg-background/80"
            />
          </div>

          <Button
            size="lg"
            className="text-lg transition-all duration-300 hover:bg-primary/90 hover:scale-105 mt-4"
            asChild
          >
            <Link to="/$id" params={{ id: roomId }}>
              Play Now
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
