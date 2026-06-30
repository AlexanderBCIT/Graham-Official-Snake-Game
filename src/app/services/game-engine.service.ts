import { Injectable, signal, computed } from '@angular/core';
import { Direction, GameState, Point } from '../models/score.model';

const GRID_SIZE = 20;
const START_TICK_MS = 130;
const MIN_TICK_MS = 70;
const TICK_DECAY = 2.5;

@Injectable({ providedIn: 'root' })
export class GameEngineService {
  readonly gridSize = GRID_SIZE;

  private readonly state = signal<GameState>(this.buildInitialState());

  readonly snake = computed(() => this.state().snake);
  readonly food = computed(() => this.state().food);
  readonly score = computed(() => this.state().score);
  readonly alive = computed(() => this.state().alive);
  readonly paused = computed(() => this.state().paused);
  readonly tickMs = computed(() => this.state().tickMs);

  private buildInitialState(): GameState {
    return {
      snake: [
        { x: 9, y: 10 },
        { x: 8, y: 10 },
        { x: 7, y: 10 },
      ],
      food: { x: 14, y: 10 },
      direction: 'right',
      nextDirection: 'right',
      score: 0,
      tickMs: START_TICK_MS,
      alive: true,
      paused: false,
    };
  }

  reset(): void {
    const initial = this.buildInitialState();
    initial.food = this.randomFreeCell(initial.snake);
    this.state.set(initial);
  }

  setDirection(dir: Direction): void {
    const opposite: Record<Direction, Direction> = {
      up: 'down',
      down: 'up',
      left: 'right',
      right: 'left',
    };
    const current = this.state();
    if (opposite[dir] === current.direction) return;
    this.state.update((s) => ({ ...s, nextDirection: dir }));
  }

  togglePause(): void {
    if (!this.state().alive) return;
    this.state.update((s) => ({ ...s, paused: !s.paused }));
  }

  /** Advances the game by one tick. Returns true if the snake just died this tick. */
  step(): boolean {
    const s = this.state();
    if (!s.alive || s.paused) return false;

    const direction = s.nextDirection;
    const head = { ...s.snake[0] };

    if (direction === 'up') head.y--;
    if (direction === 'down') head.y++;
    if (direction === 'left') head.x--;
    if (direction === 'right') head.x++;

    const outOfBounds =
      head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE;
    const hitSelf = s.snake.some((seg) => seg.x === head.x && seg.y === head.y);

    if (outOfBounds || hitSelf) {
      this.state.update((cur) => ({ ...cur, alive: false, direction }));
      return true;
    }

    const ateFood = head.x === s.food.x && head.y === s.food.y;
    const newSnake = [head, ...s.snake];
    if (!ateFood) newSnake.pop();

    this.state.update((cur) => ({
      ...cur,
      snake: newSnake,
      direction,
      score: ateFood ? cur.score + 1 : cur.score,
      tickMs: ateFood
        ? Math.max(MIN_TICK_MS, cur.tickMs - TICK_DECAY)
        : cur.tickMs,
      food: ateFood ? this.randomFreeCell(newSnake) : cur.food,
    }));

    return false;
  }

  private randomFreeCell(occupied: Point[]): Point {
    let candidate: Point;
    do {
      candidate = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
    } while (occupied.some((p) => p.x === candidate.x && p.y === candidate.y));
    return candidate;
  }
}