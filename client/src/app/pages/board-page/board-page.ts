import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FoursomeComponent } from '@app/components/foursome/foursome';
import { Header } from '@app/components/header/header';
import { Leaderboard } from '@app/components/leaderboard/leaderboard';
import { Player, PlayerDuo } from '@app/interfaces/player';
import { TeamEnum } from '@app/interfaces/team';
import { FoursomeService } from '@app/services/foursome.service';

interface SavedFoursome {
  id?: number;
  whitePlayers?: Player[];
  bluePlayers?: Player[];
  whiteScore?: number;
  blueScore?: number;
  whiteHandicap?: number;
  blueHandicap?: number;
  whiteStats?: any[];
  blueStats?: any[];
}

@Component({
  selector: 'app-board-page',
  standalone: true,
  imports: [Header, Leaderboard, FoursomeComponent],
  templateUrl: './board-page.html',
  styleUrl: './board-page.scss',
})
export class BoardPage implements OnInit {
  readonly dayStorageKey = 'golf-board-selected-day';
  readonly TeamEnum = TeamEnum;

  leaderboardData: PlayerDuo[] = [];
  foursomes: Array<{ title: string; duo1: PlayerDuo; duo2: PlayerDuo }> = [];
  selectedDay = this.getStoredDay();

  constructor(private foursomeService: FoursomeService, private readonly cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.loadDayFoursomes(this.selectedDay);
  }
  
  selectDay(day: number): void {
    this.selectedDay = day;
    localStorage.setItem(this.dayStorageKey, String(day));
    this.loadDayFoursomes(day);
  }

  private getStoredDay(): number {
    const savedDay = Number(localStorage.getItem(this.dayStorageKey));
    return savedDay === 1 || savedDay === 2 ? savedDay : 1;
  }

  private getFallbackHoleStats(stats: any[] = []) {
    const lastHole = stats[stats.length - 1];
    return lastHole ?? {
      holeNumber: 0,
      isPar3: false,
      hasHitInFairway: false,
      hasHitInHazard: false,
      nbrOfPutt: 0,
      score: 0,
      driveTakenBy: '',
    };
  }

  private buildDuoFromTeam(teamPlayers: Player[], teamColor: TeamEnum, stats: any[] = [], score: number = 0, handicap: number = 0): PlayerDuo {
    const player1 = teamPlayers[0] ?? { id: '', name: 'TBD', duoIds: [], driveTaken: 0, drivePar3Taken: 0 };
    const player2 = teamPlayers[1] ?? { id: '', name: 'TBD', duoIds: [], driveTaken: 0, drivePar3Taken: 0 };

    return {
      id: `${teamColor}-${player1.id || 'empty'}-${player2.id || 'empty'}`,
      player1,
      player2,
      teamColor,
      totalScore: score + handicap,
      adjustScore: handicap,
      handicap,
      lastHole: this.getFallbackHoleStats(stats),
      stats: stats ?? [],
    };
  }

  private getTeamDuoForFoursome(foursome: { duo1: PlayerDuo; duo2: PlayerDuo }, teamColor: TeamEnum): PlayerDuo | null {
    if (!foursome) return null;
    if (foursome.duo1?.teamColor === teamColor) return foursome.duo1;
    if (foursome.duo2?.teamColor === teamColor) return foursome.duo2;
    return null;
  }

  getGlobalTeamSummary(teamColor: TeamEnum): { score: number; calculatedHole: number } {
    if (!this.foursomes.length) {
      return { score: 0, calculatedHole: 0 };
    }

    const holeNumbers = new Set<number>();
    this.foursomes.forEach((foursome) => {
      const duo = this.getTeamDuoForFoursome(foursome, teamColor);
      if (!duo) return;
      duo.stats?.forEach((hole) => {
        if (hole?.holeNumber) {
          holeNumbers.add(hole.holeNumber);
        }
      });
    });

    let totalScore = 0;
    let calculatedHole = 0;

    [...holeNumbers]
      .sort((a, b) => a - b)
      .forEach((holeNumber) => {
        const isHoleComplete = this.foursomes.every((foursome) => {
          const duo = this.getTeamDuoForFoursome(foursome, teamColor);
          return !!duo?.stats?.some((hole) => hole.holeNumber === holeNumber);
        });

        if (!isHoleComplete) {
          return;
        }

        const bestScoreForHole = this.foursomes
          .map((foursome) => this.getTeamDuoForFoursome(foursome, teamColor))
          .filter((duo): duo is PlayerDuo => !!duo)
          .map((duo) => duo.stats.find((hole) => hole.holeNumber === holeNumber)?.score ?? Number.POSITIVE_INFINITY)
          .filter((score) => Number.isFinite(score))
          .reduce((best, current) => Math.min(best, current), Number.POSITIVE_INFINITY);

        if (!Number.isFinite(bestScoreForHole)) {
          return;
        }

        totalScore += bestScoreForHole;
        calculatedHole = holeNumber;
      });

    return { score: totalScore, calculatedHole };
  }

  private loadDayFoursomes(day: number): void {
    this.leaderboardData = [];
    this.foursomes = [];

    this.foursomeService.getFoursomeByDay(day).subscribe({
      next: (foursomes: Array<{
        whitePlayers?: Player[];
        bluePlayers?: Player[];
        whiteScore?: number;
        blueScore?: number;
        whiteHandicap?: number;
        blueHandicap?: number;
        whiteStats?: any[];
        blueStats?: any[];
      }>) => {
        const duoList: PlayerDuo[] = [];
        const pairedFoursomes: Array<{ title: string; duo1: PlayerDuo; duo2: PlayerDuo }> = [];

        (foursomes ?? []).forEach((foursome, index) => {
          const whiteHandicap = Number(foursome.whiteHandicap ?? 0);
          const blueHandicap = Number(foursome.blueHandicap ?? 0);

          const whiteDuo = this.buildDuoFromTeam(
            foursome.whitePlayers ?? [],
            TeamEnum.WHITE,
            foursome.whiteStats ?? [],
            foursome.whiteScore ?? 0,
            whiteHandicap,
          );

          const blueDuo = this.buildDuoFromTeam(
            foursome.bluePlayers ?? [],
            TeamEnum.BLUE,
            foursome.blueStats ?? [],
            foursome.blueScore ?? 0,
            blueHandicap,
          );

          duoList.push(whiteDuo, blueDuo);

          pairedFoursomes.push({
            title: `FOURSOME ${index + 1}`,
            duo1: blueDuo,
            duo2: whiteDuo,
          });
        });

        this.leaderboardData = [...duoList];
        this.foursomes = pairedFoursomes;
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error('Failed to load foursomes', err);
        this.leaderboardData = [];
        this.foursomes = [];
      },
    });
  }
}
