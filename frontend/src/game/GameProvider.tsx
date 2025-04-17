import { KeyboardControls, useKeyboardControls } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import type { ClientToServer, ServerToClient } from "common";
import { CONTROLS } from "game";
import { Game } from "game";
import { WebSocket as RWS } from "partysocket";
import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { toast } from "sonner";
import type { Object3D } from "three";
import { usePlayerName } from "@/state/player";

const keyboardMap = [
  { name: CONTROLS.forward, keys: ["ArrowUp", "KeyW"] },
  { name: CONTROLS.backward, keys: ["ArrowDown", "KeyS"] },
  { name: CONTROLS.left, keys: ["ArrowLeft", "KeyA"] },
  { name: CONTROLS.right, keys: ["ArrowRight", "KeyD"] },
  { name: CONTROLS.brake, keys: ["Space"] },
  { name: CONTROLS.reset, keys: ["Backspace"] },
  { name: CONTROLS.jump, keys: ["KeyJ"] },
];

const GameContext = createContext<{
  game: Game;
  ws: React.RefObject<RWS | null>;
  carRef: React.RefObject<Object3D | null>;
  players: string[];
  initPlayers: (players: string[]) => void;
  addPlayer: (playerId: string) => void;
  removePlayer: (playerId: string) => void;
} | null>(null);

type GameProviderProps = {
  roomId: string;
  children: ReactNode;
};

export function useGame() {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error("useGame must be used within a GameProvider");
  }
  return context;
}

export function GameProvider({ roomId, children }: GameProviderProps) {
  const GAME = useRef(new Game());
  const ws = useRef<RWS | null>(null);
  const carRef = useRef<Object3D | null>(null);

  const playerName = usePlayerName();

  const [players, setPlayers] = useState<string[]>([playerName]);
  const initPlayers = useCallback((players: string[]) => {
    for (const playerId of players) {
      GAME.current.addPlayer(playerId);
    }
    setPlayers(players);
  }, []);
  const addPlayer = useCallback((playerId: string) => {
    GAME.current.addPlayer(playerId);
    setPlayers((players) => {
      if (players.includes(playerId)) {
        return players;
      }
      return [...players, playerId];
    });
  }, []);
  const removePlayer = useCallback((playerId: string) => {
    GAME.current.removePlayer(playerId);
    setPlayers((players) => {
      if (!players.includes(playerId)) {
        return players;
      }
      return players.filter((p) => p !== playerId);
    });
  }, []);

  useEffect(() => {
    GAME.current.addPlayer(playerName);

    ws.current = new RWS(
      import.meta.env.VITE_API_URL.replace("http", "ws") + "/ws/" + roomId,
    );

    ws.current.addEventListener("message", (event) => {
      const msg = JSON.parse(event.data) as ServerToClient;

      switch (msg.type) {
        case "playersList":
          initPlayers(msg.players);
          break;

        case "playerJoined":
          toast(`Player joined: ${msg.playerId}`);
          addPlayer(msg.playerId);
          break;

        case "playerLeft":
          toast(`Player left: ${msg.playerId}`);
          removePlayer(msg.playerId);
          break;

        case "physicsUpdate":
          GAME.current.world.syncState(msg.gameState);
          break;
      }
    });

    ws.current.addEventListener("open", () => {
      const joinMsg = {
        type: "joinGame",
        playerId: playerName,
      } satisfies ClientToServer;

      ws.current?.send(JSON.stringify(joinMsg));
    });

    return () => {
      if (ws.current && ws.current.readyState === WebSocket.OPEN) {
        const leaveMsg = {
          type: "leaveGame",
          playerId: playerName,
        } satisfies ClientToServer;
        ws.current.send(JSON.stringify(leaveMsg));
      }

      ws.current?.close();
    };
  }, [roomId, playerName, initPlayers, addPlayer, removePlayer]);

  return (
    <GameContext.Provider
      value={{
        game: GAME.current,
        ws,
        carRef,
        players,
        initPlayers,
        addPlayer,
        removePlayer,
      }}
    >
      <KeyboardControls map={keyboardMap}>
        <Canvas>
          <Controls />
          {children}
        </Canvas>
      </KeyboardControls>
    </GameContext.Provider>
  );
}

function Controls() {
  const { game, ws } = useGame();
  const playerName = usePlayerName();
  const [sub, get] = useKeyboardControls<CONTROLS>();

  useEffect(() => {
    return sub((controls) => {
      if (!ws.current || ws.current.readyState !== WebSocket.OPEN) {
        return;
      }

      const controlsMsg = {
        type: "controlsUpdate",
        playerId: playerName,
        controls,
      } satisfies ClientToServer;

      ws.current?.send(JSON.stringify(controlsMsg));
    });
  }, [ws.current, playerName, sub]);

  useFrame(() => {
    game.world.applyCarControls(playerName, get());
    game.update();
  });

  return null;
}
