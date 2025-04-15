export * from "./config/arena";
export * from "./config/ball";
export * from "./config/car";
export * from "./config/wheel";
export * from "./config/world";

export * from "./Game";

export interface WorldState {
  ball: {
    position: [number, number, number];
    quaternion: [number, number, number, number];
  };
  cars: Record<
    string,
    {
      position: [number, number, number];
      quaternion: [number, number, number, number];
    }
  >;
}
