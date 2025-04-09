import "./index.css";
import { MainMenu } from "./components/MainMenu";
import { Button } from "./components/ui/button";
import { Scene } from "./game/Scene";
import { useGameStore } from "./state/store";

export function App() {
  const { isPlaying, resetScore, setIsPlaying } = useGameStore();

  const handleBackToMenu = () => {
    setIsPlaying(false);
    resetScore();
  };

  // If not playing, show the main menu
  if (!isPlaying) {
    return <MainMenu />;
  }

  // Otherwise, show the game
  return (
    <div className="flex flex-col h-screen w-full bg-background text-foreground">
      <div className="absolute top-0 left-0 right-0 z-10 p-4 flex flex-col gap-4">
        <div className="flex gap-2 justify-center">
          <Button variant="secondary" onClick={handleBackToMenu}>
            Back to Menu
          </Button>
        </div>
      </div>
      <div className="flex-1 w-full">
        <Scene />
      </div>
    </div>
  );
}
