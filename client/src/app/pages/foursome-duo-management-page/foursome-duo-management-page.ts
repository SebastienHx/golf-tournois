import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Player } from '@app/interfaces/player';
import { FoursomeService } from '@app/services/foursome.service';
import { PlayerService } from '@app/services/player.service';

type TeamName = 'WHITE' | 'BLUE';

interface FoursomeDraft {
  id: number;
  whitePlayers: Player[];
  bluePlayers: Player[];
  whiteScore: number;
  blueScore: number;
  whiteHandicap: number;
  blueHandicap: number;
}

interface TeamPickerState {
  foursomeId: number;
  team: TeamName;
}

@Component({
  selector: 'app-foursome-duo-management-page',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './foursome-duo-management-page.html',
  styleUrl: './foursome-duo-management-page.scss',
})
export class FoursomeDuoManagementPage {
  readonly selectedDay = signal<1 | 2>(1);
  readonly allPlayers = signal<Player[]>([]);
  readonly isLoading = signal<boolean>(false);
  readonly foursomesByDay = signal<Record<1 | 2, FoursomeDraft[]>>({ 1: [], 2: [] });
  readonly activePicker = signal<TeamPickerState | null>(null);

  constructor(
    private readonly playerService: PlayerService,
    private readonly foursomeService: FoursomeService,
  ) {}

  ngOnInit(): void {
    this.loadPlayers();
    this.loadFoursomesForSelectedDay();
  }

  loadPlayers(): void {
    this.isLoading.set(true);
    this.playerService.getAllPlayers().subscribe({
      next: (players) => {
        this.allPlayers.set(players);
        this.isLoading.set(false);
      },
      error: () => {
        this.isLoading.set(false);
      },
    });
  }

  selectDay(day: 1 | 2): void {
    this.selectedDay.set(day);
    this.activePicker.set(null);
    this.loadFoursomesForSelectedDay();
  }

  loadFoursomesForSelectedDay(): void {
    this.foursomeService.getFoursomeByDay(this.selectedDay()).subscribe({
      next: (foursomes) => {
        this.foursomesByDay.set({
          ...this.foursomesByDay(),
          [this.selectedDay()]: foursomes.length > 0 ? foursomes : [this.createEmptyFoursome()],
        });
      },
      error: () => {
        this.foursomesByDay.set({
          ...this.foursomesByDay(),
          [this.selectedDay()]: [this.createEmptyFoursome()],
        });
      },
    });
  }

  createEmptyFoursome(): FoursomeDraft {
    return {
      id: Date.now() + Math.floor(Math.random() * 1000),
      whitePlayers: [],
      bluePlayers: [],
      whiteScore: 0,
      blueScore: 0,
      whiteHandicap: 0,
      blueHandicap: 0,
    };
  }

  addFoursome(): void {
    const selectedDay = this.selectedDay();
    const currentDayFoursomes = this.foursomesByDay()[selectedDay];
    const nextFoursome = this.createEmptyFoursome();

    this.foursomesByDay.set({
      ...this.foursomesByDay(),
      [selectedDay]: [...currentDayFoursomes, nextFoursome],
    });
  }

  removeFoursome(foursomeId: number): void {
    const selectedDay = this.selectedDay();
    const nextFoursomes = this.getFoursomesForSelectedDay().filter((foursome) => foursome.id !== foursomeId);

    this.foursomesByDay.set({
      ...this.foursomesByDay(),
      [selectedDay]: nextFoursomes,
    });

    if (this.activePicker()?.foursomeId === foursomeId) {
      this.activePicker.set(null);
    }

    if (nextFoursomes.length === 0) {
      this.addFoursome();
    }
  }

  toggleTeamPicker(foursomeId: number, team: TeamName): void {
    const current = this.activePicker();
    if (current?.foursomeId === foursomeId && current.team === team) {
      this.activePicker.set(null);
      return;
    }

    this.activePicker.set({ foursomeId, team });
  }

  closePicker(): void {
    this.activePicker.set(null);
  }

  getAvailablePlayersForTeam(foursomeId: number, team: TeamName): Player[] {
    const targetFoursome = this.getFoursomesForSelectedDay().find((foursome) => foursome.id === foursomeId);
    if (!targetFoursome) {
      return [];
    }

    const selectedTeam = team === 'WHITE' ? targetFoursome.whitePlayers : targetFoursome.bluePlayers;
    const usedPlayerIds = new Set<string>(
      this.getFoursomesForSelectedDay().flatMap((foursome) => {
        if (foursome.id === foursomeId) {
          return [];
        }

        return [...foursome.whitePlayers, ...foursome.bluePlayers].map((player) => player.id);
      }),
    );

    return this.allPlayers().filter((player) => {
      const isAlreadySelectedInThisTeam = selectedTeam.some((selectedPlayer) => selectedPlayer.id === player.id);
      return !usedPlayerIds.has(player.id) || isAlreadySelectedInThisTeam;
    });
  }

  addPlayerToTeam(foursomeId: number, team: TeamName, playerId: string): void {
    const player = this.allPlayers().find((entry) => entry.id === playerId);
    if (!player) {
      return;
    }

    const dayFoursomes = this.getFoursomesForSelectedDay();
    const foursome = dayFoursomes.find((entry) => entry.id === foursomeId);
    if (!foursome) {
      return;
    }

    const teamPlayers = team === 'WHITE' ? foursome.whitePlayers : foursome.bluePlayers;
    if (teamPlayers.length >= 2) {
      return;
    }

    const playerAlreadyPresent = [...foursome.whitePlayers, ...foursome.bluePlayers].some((entry) => entry.id === playerId);
    if (playerAlreadyPresent) {
      return;
    }

    const nextFoursomes = dayFoursomes.map((entry) => {
      if (entry.id !== foursomeId) {
        return entry;
      }

      return {
        ...entry,
        whitePlayers: team === 'WHITE' ? [...entry.whitePlayers, player] : entry.whitePlayers,
        bluePlayers: team === 'BLUE' ? [...entry.bluePlayers, player] : entry.bluePlayers,
      };
    });

    this.foursomesByDay.set({
      ...this.foursomesByDay(),
      [this.selectedDay()]: nextFoursomes,
    });

    this.activePicker.set(null);
  }

  updateHandicap(foursomeId: number, team: TeamName, value: string): void {
    const dayFoursomes = this.getFoursomesForSelectedDay();
    const nextFoursomes = dayFoursomes.map((entry) => {
      if (entry.id !== foursomeId) {
        return entry;
      }

      const handicapValue = Number.parseInt(value, 10) || 0;

      return {
        ...entry,
        whiteHandicap: team === 'WHITE' ? handicapValue : entry.whiteHandicap,
        blueHandicap: team === 'BLUE' ? handicapValue : entry.blueHandicap,
      };
    });

    this.foursomesByDay.set({
      ...this.foursomesByDay(),
      [this.selectedDay()]: nextFoursomes,
    });
  }

  removePlayerFromTeam(foursomeId: number, team: TeamName, playerId: string): void {
    const dayFoursomes = this.getFoursomesForSelectedDay();
    const nextFoursomes = dayFoursomes.map((entry) => {
      if (entry.id !== foursomeId) {
        return entry;
      }

      const currentTeam = team === 'WHITE' ? entry.whitePlayers : entry.bluePlayers;
      const updatedTeam = currentTeam.filter((player) => player.id !== playerId);

      return {
        ...entry,
        whitePlayers: team === 'WHITE' ? updatedTeam : entry.whitePlayers,
        bluePlayers: team === 'BLUE' ? updatedTeam : entry.bluePlayers,
      };
    });

    this.foursomesByDay.set({
      ...this.foursomesByDay(),
      [this.selectedDay()]: nextFoursomes,
    });
  }

  saveFoursomesForSelectedDay(): void {
    const foursomes = this.getFoursomesForSelectedDay();
    this.foursomeService.saveFoursomesForDay(this.selectedDay(), foursomes).subscribe({
      next: () => {
        console.log('Foursomes saved successfully');
      },
      error: () => {
        console.error('Failed to save foursomes');
      },
    });
  }

  getFoursomesForSelectedDay(): FoursomeDraft[] {
    return this.foursomesByDay()[this.selectedDay()];
  }
}

