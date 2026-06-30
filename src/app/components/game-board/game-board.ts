import {
  Component,
  ElementRef,
  ViewChild,
  AfterViewInit,
  HostListener,
  effect,
  inject,
} from '@angular/core';
import { GameEngineService } from '../../services/game-engine.service';
import { Direction, Point } from '../../models/score.model';

@Component({
  selector: 'app-game-board',
  standalone: true,
  imports: [],
  templateUrl: './game-board.html',
  styleUrl: './game-board.scss',
})
export class GameBoard implements AfterViewInit {
  @ViewChild('boardCanvas') private canvasRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('boardWrap') private wrapRef!: ElementRef<HTMLDivElement>;

  readonly engine = inject(GameEngineService);

  private ctx!: CanvasRenderingContext2D;
  private cellPx = 0;
  private touchStart: { x: number; y: number } | null = null;

  constructor() {
    // Redraw any time the snake, food, or game-over state changes.
    effect(() => {
      this.engine.snake();
      this.engine.food();
      this.engine.alive();
      if (this.ctx) this.draw();
    });
  }

  ngAfterViewInit(): void {
    this.ctx = this.canvasRef.nativeElement.getContext('2d')!;
    this.fitCanvas();
    this.draw();
  }

  @HostListener('window:resize')
  fitCanvas(): void {
    const wrap = this.wrapRef.nativeElement;
    const canvas = this.canvasRef.nativeElement;
    const size = Math.floor(wrap.clientWidth * (window.devicePixelRatio || 1));
    canvas.width = size;
    canvas.height = size;
    this.cellPx = size / this.engine.gridSize;
    if (this.ctx) this.draw();
  }

  @HostListener('window:keydown', ['$event'])
  onKeydown(e: KeyboardEvent): void {
    const map: Record<string, Direction> = {
      ArrowUp: 'up',
      ArrowDown: 'down',
      ArrowLeft: 'left',
      ArrowRight: 'right',
      w: 'up',
      s: 'down',
      a: 'left',
      d: 'right',
    };
    if (map[e.key]) {
      e.preventDefault();
      this.engine.setDirection(map[e.key]);
    }
    if (e.key === ' ') {
      e.preventDefault();
      this.engine.togglePause();
    }
  }

  onDpad(dir: Direction): void {
    this.engine.setDirection(dir);
  }

  onDpadTouch(dir: Direction, e: TouchEvent): void {
    e.preventDefault();
    this.engine.setDirection(dir);
  }

  onPauseClick(): void {
    this.engine.togglePause();
  }

  onTouchStart(e: TouchEvent): void {
    const t = e.changedTouches[0];
    this.touchStart = { x: t.clientX, y: t.clientY };
  }

  onTouchEnd(e: TouchEvent): void {
    if (!this.touchStart) return;
    const t = e.changedTouches[0];
    const dx = t.clientX - this.touchStart.x;
    const dy = t.clientY - this.touchStart.y;

    if (Math.abs(dx) > Math.abs(dy)) {
      if (Math.abs(dx) > 24) this.engine.setDirection(dx > 0 ? 'right' : 'left');
    } else {
      if (Math.abs(dy) > 24) this.engine.setDirection(dy > 0 ? 'down' : 'up');
    }
    this.touchStart = null;
  }

  private draw(): void {
    const ctx = this.ctx;
    const canvas = this.canvasRef.nativeElement;
    const cellPx = this.cellPx;
    const gridSize = this.engine.gridSize;

    ctx.fillStyle = '#0a0f0d';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = 'rgba(255,255,255,0.03)';
    ctx.lineWidth = 1;
    for (let i = 1; i < gridSize; i++) {
      ctx.beginPath();
      ctx.moveTo(i * cellPx, 0);
      ctx.lineTo(i * cellPx, canvas.height);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, i * cellPx);
      ctx.lineTo(canvas.width, i * cellPx);
      ctx.stroke();
    }

    this.drawFood(cellPx);
    this.drawSnake(cellPx);
  }

  private drawFood(cellPx: number): void {
    const ctx = this.ctx;
    const food = this.engine.food();
    const fc = { x: food.x * cellPx + cellPx / 2, y: food.y * cellPx + cellPx / 2 };
    const grad = ctx.createRadialGradient(fc.x, fc.y, 1, fc.x, fc.y, cellPx * 0.8);
    grad.addColorStop(0, '#ff8fa6');
    grad.addColorStop(1, '#ff5277');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(fc.x, fc.y, cellPx * 0.36, 0, Math.PI * 2);
    ctx.fill();
  }

  private drawSnake(cellPx: number): void {
    const ctx = this.ctx;
    const snake = this.engine.snake();

    snake.forEach((segment: Point, i: number) => {
      const t = i / Math.max(1, snake.length - 1);
      const color = i === 0 ? '#7cffb2' : this.lerpColor('#3ddc84', '#1a7a4c', t);
      ctx.fillStyle = color;
      const pad = i === 0 ? 1 : 1.5;
      this.roundRect(
        segment.x * cellPx + pad,
        segment.y * cellPx + pad,
        cellPx - pad * 2,
        cellPx - pad * 2,
        4
      );
      ctx.fill();
    });
  }

  private roundRect(x: number, y: number, w: number, h: number, r: number): void {
    const ctx = this.ctx;
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }

  private lerpColor(a: string, b: string, t: number): string {
    const ah = parseInt(a.slice(1), 16);
    const bh = parseInt(b.slice(1), 16);
    const ar = (ah >> 16) & 255, ag = (ah >> 8) & 255, ab = ah & 255;
    const br = (bh >> 16) & 255, bg = (bh >> 8) & 255, bb = bh & 255;
    const rr = Math.round(ar + (br - ar) * t);
    const rg = Math.round(ag + (bg - ag) * t);
    const rb = Math.round(ab + (bb - ab) * t);
    return `rgb(${rr},${rg},${rb})`;
  }
}