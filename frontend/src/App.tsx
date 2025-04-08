import "./index.css";
import { Scene } from "./game/Scene";
import { useGameStore } from "./state/store";
import { Button } from "./components/ui/button";

export function App() {
	const { score, boostAmount, incrementScore, resetScore } = useGameStore();

	return (
		<div className="flex flex-col h-screen w-full bg-background text-foreground">
			<div className="absolute top-0 left-0 right-0 z-10 p-4 flex flex-col gap-4">
				<div className="flex justify-between items-center bg-card/80 backdrop-blur-sm p-3 rounded-lg shadow-md">
					<span className="text-blue-500 font-bold">Blue: {score.blue}</span>
					<span className="text-orange-500 font-bold">Orange: {score.orange}</span>
				</div>
				<div className="bg-card/80 backdrop-blur-sm p-3 rounded-lg shadow-md">
					<div className="text-sm mb-1">Boost: {boostAmount}%</div>
					<div className="w-full h-2 bg-muted rounded-full overflow-hidden">
						<div
							className="h-full bg-primary transition-all duration-300 ease-in-out"
							style={{ width: `${boostAmount}%` }}
						/>
					</div>
				</div>
				<div className="flex gap-2 justify-center">
					<Button
						variant="default"
						className="bg-blue-500 hover:bg-blue-600"
						onClick={() => incrementScore("blue")}
					>
						Blue Goal
					</Button>
					<Button
						variant="default"
						className="bg-orange-500 hover:bg-orange-600"
						onClick={() => incrementScore("orange")}
					>
						Orange Goal
					</Button>
					<Button
						variant="outline"
						onClick={resetScore}
					>
						Reset Score
					</Button>
				</div>
			</div>
			<div className="flex-1 w-full">
				<Scene />
			</div>
		</div>
	);
}
