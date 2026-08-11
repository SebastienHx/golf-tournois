import { Component, EventEmitter, Output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-lock',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-lock-section.html',
  styleUrls: ['./admin-lock-section.scss']
})
export class AdminLockSection {
  @Output() unlocked = new EventEmitter<boolean>();

  password = signal<string>('');
  errorMessage = signal<string>('');
  isUnlocked = signal<boolean>(false);

  // Correct password from the hint
  private readonly CORRECT_PASSWORD = 'golf';

  unlock(): void {
    if (this.password() === this.CORRECT_PASSWORD) {
      this.isUnlocked.set(true);
      this.errorMessage.set('');
      this.unlocked.emit(true);
    } else {
      this.errorMessage.set('Incorrect password. Please try again.');
    }
  }
}