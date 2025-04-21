import { useEffect, useState } from "react";
import { useGame } from "./GameProvider";

export function ScoreDisplay() {
  const { game } = useGame();
  const [score, setScore] = useState({ team1: 0, team2: 0 });
  const [lastGoal, setLastGoal] = useState<
    { team: 1 | 2; time: number } | undefined
  >(undefined);
  const [showGoalMessage, setShowGoalMessage] = useState(false);

  useEffect(() => {
    // Set up an interval to check for score updates
    const scoreInterval = setInterval(() => {
      // Get the current score from the game state
      const worldState = game.getWorldState();

      if (worldState.score) {
        setScore(worldState.score);
      }

      // Check if there's a new goal
      if (
        worldState.lastGoal &&
        (!lastGoal || worldState.lastGoal.time !== lastGoal.time)
      ) {
        setLastGoal(worldState.lastGoal);
        setShowGoalMessage(true);

        // Hide the goal message after 3 seconds
        setTimeout(() => {
          setShowGoalMessage(false);
        }, 3000);
      }
    }, 100);

    // Clean up the interval when component unmounts
    return () => clearInterval(scoreInterval);
  }, [game, lastGoal]);

  return (
    <div className="absolute top-0 left-0 right-0 z-20 p-4 flex flex-col items-center">
      {/* Score display */}
      <div className="bg-black/50 rounded-lg px-6 py-3 flex items-center justify-center gap-4">
        <div className="flex flex-col items-center">
          <span className="text-blue-400 font-bold text-xl">BLUE</span>
          <span className="text-white text-3xl font-bold">{score.team1}</span>
        </div>

        <div className="text-white text-2xl font-bold">-</div>

        <div className="flex flex-col items-center">
          <span className="text-orange-400 font-bold text-xl">ORANGE</span>
          <span className="text-white text-3xl font-bold">{score.team2}</span>
        </div>
      </div>

      {/* Goal message */}
      {showGoalMessage && lastGoal && (
        <div className="mt-4 bg-black/70 rounded-lg px-8 py-4 animate-bounce">
          <span className="text-white text-2xl font-bold">
            GOAL! {lastGoal.team === 1 ? "BLUE" : "ORANGE"} TEAM SCORES!
          </span>
        </div>
      )}
    </div>
  );
}
