import { Component, inject, signal, OnDestroy } from '@angular/core';
import { GameBoard } from '../game-board/game-board';
import { Leaderboard } from '../leaderboard/leaderboard';
import { UsernameDialog } from '../username-dialog/username-dialog';
import { GameOverDialog } from '../game-over-dialog/game-over-dialog';
import { GameEngineService } from '../../services/game-engine.service';
import { LeaderboardService } from '../../services/leaderboard.service';

const USERNAME_STORAGE_KEY = 'byteSnakeUsername';

@Component({
  selector: 'app-snake-game',
  standalone: true,
  imports: [GameBoard, Leaderboard, UsernameDialog, GameOverDialog],
  templateUrl: './snake-game.html',
  styleUrl: './snake-game.scss',
})
export class SnakeGame implements OnDestroy {
  readonly engine = inject(GameEngineService);
  private readonly leaderboardService = inject(LeaderboardService);

  readonly username = signal(localStorage.getItem(USERNAME_STORAGE_KEY) ?? '');
  readonly showUsernameDialog = signal(true);
  readonly showGameOverDialog = signal(false);

  private loopTimer: ReturnType<typeof setTimeout> | null = null;

  onUsernameSave(name: string): void {
    this.username.set(name);
    localStorage.setItem(USERNAME_STORAGE_KEY, name);
    this.showUsernameDialog.set(false);
    this.resetAndPlay();
  }

  onPlayerTagClick(): void {
    this.showUsernameDialog.set(true);
  }

  onChangeNameClick(): void {
    this.showGameOverDialog.set(false);
    this.showUsernameDialog.set(true);
  }

  onPlayAgain(): void {
    this.showGameOverDialog.set(false);
    this.resetAndPlay();
  }

  private resetAndPlay(): void {
    this.engine.reset();
    this.runLoop();
  }

  private runLoop(): void {
    if (this.loopTimer) clearTimeout(this.loopTimer);

    const died = this.engine.step();
    if (died) {
      this.onGameOver();
      return;
    }

    this.loopTimer = setTimeout(() => this.runLoop(), this.engine.tickMs());
  }

  private onGameOver(): void {
    this.showGameOverDialog.set(true);
    const name = this.username();
    const score = this.engine.score();
    if (name) {
      this.leaderboardService.submitScore(name, score);
    }
  }

  ngOnDestroy(): void {
    if (this.loopTimer) clearTimeout(this.loopTimer);
  }
}