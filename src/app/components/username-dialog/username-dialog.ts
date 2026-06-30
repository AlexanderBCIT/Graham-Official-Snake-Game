import { Component, input, output, effect } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-username-dialog',
  standalone: true,
  imports: [FormsModule, DialogModule, InputTextModule, ButtonModule],
  templateUrl: './username-dialog.html',
  styleUrl: './username-dialog.scss',
})
export class UsernameDialog {
  visible = input(false);
  initialValue = input('');
  save = output<string>();

  usernameValue = '';
  errorMessage = '';

  constructor() {
    // Pre-fill the field with the saved username whenever the dialog opens.
    effect(() => {
      if (this.visible()) {
        this.usernameValue = this.initialValue();
        this.errorMessage = '';
      }
    });
  }

  onSave(): void {
    const trimmed = this.usernameValue.trim();
    if (!trimmed) {
      this.errorMessage = 'enter a name';
      return;
    }
    if (trimmed.length > 14) {
      this.errorMessage = 'max 14 characters';
      return;
    }
    this.save.emit(trimmed);
  }

  onKeydown(e: KeyboardEvent): void {
    if (e.key === 'Enter') this.onSave();
  }
}