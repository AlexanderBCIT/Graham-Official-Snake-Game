import { Component } from '@angular/core';
import { SnakeGame } from './components/snake-game/snake-game';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [SnakeGame],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {}