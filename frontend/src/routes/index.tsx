import { OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  component: Index,
});

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

export function Index() {
  return (
    <div className="relative h-screen w-full overflow-hidden">
      <div className="absolute inset-0 z-0">
        <Canvas>
          <MenuBackground />
        </Canvas>
      </div>

      <div className="absolute inset-0 z-10 bg-gradient-to-b from-background/70 to-background/90 backdrop-blur-sm" />

      <div className="absolute inset-0 z-20 flex flex-col items-center justify-center">
        <div className="mb-12 text-center">
          <h1 className="text-6xl font-bold tracking-tight text-primary mb-2 animate-fade-in">
            CAR LEAGUE
          </h1>
          <p className="text-muted-foreground text-lg animate-fade-in animation-delay-200">
            The ultimate car soccer experience
          </p>
        </div>

        <div className="flex flex-col gap-4 w-64 animate-fade-in animation-delay-400">
          <Button
            size="lg"
            className="text-lg transition-all duration-300 hover:bg-primary/90 hover:scale-105"
            asChild
          >
            <Link to="/$id" params={{ id: "1" }}>
              Play
            </Link>
          </Button>
        </div>

        <div className="absolute bottom-4 text-sm text-muted-foreground">
          &copy; 2023 Car League | v0.1.0
        </div>
      </div>
    </div>
  );
}
