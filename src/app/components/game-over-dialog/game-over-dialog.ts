import { Component, input, output, computed } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-game-over-dialog',
  standalone: true,
  imports: [DialogModule, ButtonModule],
  templateUrl: './game-over-dialog.html',
  styleUrl: './game-over-dialog.scss',
})
export class GameOverDialog {
  visible = input(false);
  score = input(0);

  playAgain = output<void>();
  changeName = output<void>();

  message = computed(() =>
    this.score() === 0 ? 'tough start — try again!' : 'nice run!'
  );

  onPlayAgain(): void {
    this.playAgain.emit();
  }

  onChangeName(): void {
    this.changeName.emit();
  }
}