export type Duple = [number, number];
export type Triplet = [number, number, number];
export type Quad = [number, number, number, number];

export interface WorldState {
  ball: {
    position: Triplet;
    quaternion: Quad;
  };
  cars: Record<
    string,
    {
      position: Triplet;
      quaternion: Quad;
    }
  >;
}
