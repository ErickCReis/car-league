import { useState } from "react";
import { Button } from "./ui/button";
import { useGameStore } from "../state/store";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { cn } from "@/lib/utils";

// Background scene for the main menu
function MenuBackground() {
  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <mesh rotation={[0, Math.PI / 4, 0]} position={[0, 0, -3]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="orange" />
      </mesh>
      <mesh rotation={[0, Math.PI / 6, 0]} position={[2, -1, -5]}>
        <sphereGeometry args={[0.7, 32, 32]} />
        <meshStandardMaterial color="blue" />
      </mesh>
      <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.5} />
    </>
  );
}

type MenuOption = "play" | "settings" | "profile" | "exit";

export function MainMenu() {
  const { setIsPlaying } = useGameStore();
  const [selectedOption, setSelectedOption] = useState<MenuOption | null>(null);
  const [hoverOption, setHoverOption] = useState<MenuOption | null>(null);

  const handlePlay = () => {
    setIsPlaying(true);
  };

  const handleMenuOption = (option: MenuOption) => {
    setSelectedOption(option);

    if (option === "play") {
      handlePlay();
    }
    // Other options will be implemented later
  };

  return (
    <div className="relative h-screen w-full overflow-hidden">
      {/* 3D Background */}
      <div className="absolute inset-0 z-0">
        <Canvas>
          <MenuBackground />
        </Canvas>
      </div>

      {/* Overlay with gradient */}
      <div className="absolute inset-0 z-10 bg-gradient-to-b from-background/70 to-background/90 backdrop-blur-sm" />

      {/* Menu Content */}
      <div className="absolute inset-0 z-20 flex flex-col items-center justify-center">
        <div className="mb-12 text-center">
          <h1 className="text-6xl font-bold tracking-tight text-primary mb-2 animate-fade-in">CAR LEAGUE</h1>
          <p className="text-muted-foreground text-lg animate-fade-in animation-delay-200">The ultimate car soccer experience</p>
        </div>

        <div className="flex flex-col gap-4 w-64 animate-fade-in animation-delay-400">
          <Button
            size="lg"
            className={cn(
              "text-lg transition-all duration-300",
              hoverOption === "play" && "bg-primary/90 scale-105"
            )}
            onClick={() => handleMenuOption("play")}
            onMouseEnter={() => setHoverOption("play")}
            onMouseLeave={() => setHoverOption(null)}
          >
            Play
          </Button>

          <Button
            size="lg"
            variant="secondary"
            className={cn(
              "text-lg transition-all duration-300",
              hoverOption === "settings" && "bg-secondary/90 scale-105"
            )}
            onClick={() => handleMenuOption("settings")}
            onMouseEnter={() => setHoverOption("settings")}
            onMouseLeave={() => setHoverOption(null)}
          >
            Settings
          </Button>

          <Button
            size="lg"
            variant="secondary"
            className={cn(
              "text-lg transition-all duration-300",
              hoverOption === "profile" && "bg-secondary/90 scale-105"
            )}
            onClick={() => handleMenuOption("profile")}
            onMouseEnter={() => setHoverOption("profile")}
            onMouseLeave={() => setHoverOption(null)}
          >
            Profile
          </Button>

          <Button
            size="lg"
            variant="outline"
            className={cn(
              "text-lg transition-all duration-300",
              hoverOption === "exit" && "bg-accent/90 scale-105"
            )}
            onClick={() => handleMenuOption("exit")}
            onMouseEnter={() => setHoverOption("exit")}
            onMouseLeave={() => setHoverOption(null)}
          >
            Exit
          </Button>
        </div>

        <div className="absolute bottom-4 text-sm text-muted-foreground">
          &copy; 2023 Car League | v0.1.0
        </div>
      </div>
    </div>
  );
}