import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output, signal } from '@angular/core';
import { Player } from '@app/interfaces/player';
import { PlayerService } from '@app/services/player.service';

@Component({
  selector: 'app-new-player-section',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './new-player-section.html',
  styleUrl: './new-player-section.scss',
})
export class NewPlayerSection {
  @Output() playerCreated = new EventEmitter<void>();

  constructor(private participantService: PlayerService) {}

  form = signal({
    name: '',
    duoIds: [] as string[],
    driveTaken: 0,
    drivePar3Taken: 0,
  });

  isSubmitting = signal(false);
  feedback = signal<{ message: string; type: 'success' | 'error' } | null>(null);

  updateField(field: keyof ReturnType<typeof this.form>, value: string | number): void {
    this.form.set({ ...this.form(), [field]: value });
  }

  createPlayer(): void {
    if (!this.form().name.trim()) {
      this.feedback.set({ message: 'Player name is required.', type: 'error' });
      return;
    }

    this.isSubmitting.set(true);
    this.feedback.set(null);

    this.participantService.addNewPlayer(this.form()).subscribe({
      next: (newPlayer: Player) => {
        console.log('Player created:', newPlayer);

        // Reset Form
        this.form.set({
          name: '',
          duoIds: [],
          driveTaken: 0,
          drivePar3Taken: 0,
        });

        this.feedback.set({ message: 'Player created successfully!', type: 'success' });
        this.playerCreated.emit();
        this.isSubmitting.set(false);
      },
      error: (err) => {
        const errorMsg = err?.error?.body || 'Unable to create player.';
        this.feedback.set({ message: errorMsg, type: 'error' });
        this.isSubmitting.set(false);
      },
    });
  }
}