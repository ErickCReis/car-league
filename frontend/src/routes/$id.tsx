import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { GameProvider } from "@/game/GameProvider";
import { Scene } from "@/game/Scene";
import { usePlayerName } from "@/state/player";

export const Route = createFileRoute("/$id")({
  component: RouteComponent,
});

function RouteComponent() {
  const { id } = Route.useParams();
  const playerName = usePlayerName();

  return (
    <div className="flex flex-col h-screen w-full bg-background text-foreground">
      <div className="absolute top-0 left-0 right-0 z-10 p-4 flex flex-col gap-4">
        <div className="flex gap-2 justify-between w-full">
          <div className="flex items-center gap-2">
            <span className="font-medium">{playerName}</span>
          </div>
          <Button variant="secondary" asChild>
            <Link to="/">Back to Menu</Link>
          </Button>
        </div>
      </div>
      <div className="flex-1 w-full">
        <GameProvider roomId={id}>
          <Scene />
        </GameProvider>
      </div>
    </div>
  );
}
