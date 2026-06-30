export interface Score {
}
export interface Score {
  name: string;
  score: number;
  updatedAt: number;
}

export type Direction = 'up' | 'down' | 'left' | 'right';

export interface Point {
  x: number;
  y: number;
}

export interface GameState {
  snake: Point[];
  food: Point;
  direction: Direction;
  nextDirection: Direction;
  score: number;
  tickMs: number;
  alive: boolean;
  paused: boolean;
}