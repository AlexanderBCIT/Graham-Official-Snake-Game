import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';
import { LeaderboardService } from '../../services/leaderboard.service';

@Component({
  selector: 'app-leaderboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './leaderboard.html',
  styleUrl: './leaderboard.scss',
})
export class Leaderboard {
  /** The current player's username, used to highlight their row. */
  @Input() currentUsername = '';

  private readonly leaderboardService = inject(LeaderboardService);

  readonly scores = toSignal(this.leaderboardService.getTopScores(), {
    initialValue: [],
  });

  isCurrentPlayer(name: string): boolean {
    return (
      !!this.currentUsername &&
      name.toLowerCase() === this.currentUsername.toLowerCase()
    );
  }
}