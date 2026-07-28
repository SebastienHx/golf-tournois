import { CommonModule } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NewPlayerSection } from '@app/components/new-player-section/new-player-section';
import { Player } from '@app/interfaces/player';
import { PlayerService } from '@app/services/player.service';

@Component({
  selector: 'app-player-management-page',
  standalone: true,
  imports: [CommonModule, RouterLink, NewPlayerSection],
  templateUrl: './player-management-page.html',
  styleUrl: './player-management-page.scss',
})
export class PlayerManagementPage implements OnInit {
  allPlayers = signal<Player[]>([]);
  isLoading = signal<boolean>(false);

  constructor(private participantService: PlayerService) {}

  ngOnInit(): void {
    this.getPlayers();
  }

  getPlayers(): void {
    this.isLoading.set(true);
    this.participantService.getAllPlayers().subscribe({
      next: (players: Player[]) => {
        this.allPlayers.set(players);
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false),
    });
  }

  deletePlayer(id: string): void {
    if (!confirm('Are you sure you want to remove this player?')) return;

    // Call service delete endpoint if available
    this.participantService.deletePlayer(id).subscribe(() => this.getPlayers());
  }
}