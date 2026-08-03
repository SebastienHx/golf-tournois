import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FIELD_INFO_2026 } from '@app/constants/terrain-golf-info-2026';
import { HoleStats } from '@app/interfaces/hole-stats';
import { Player, PlayerDuo } from '@app/interfaces/player';
import { TeamEnum } from '@app/interfaces/team';
import { FoursomeService } from '@app/services/foursome.service';

interface HoleInfo {
  number: number;
  par: number;
  yards: number;
}

interface ScoreDuo extends PlayerDuo {
  name: string;
  foursomeId: number;
}

@Component({
  selector: 'app-score-entry',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './score-entry-component.html',
  styleUrls: ['./score-entry-component.scss'],
})
export class ScoreEntryComponent implements OnInit {
  readonly dayStorageKey = 'golf-board-selected-day';

  holes: HoleInfo[] = [];

  selectedTeamId = '';
  selectedHoleNum = 1;
  duoList: ScoreDuo[] = [];
  selectedDay = this.getStoredDay();

  private foursomes: Array<{
    id?: number;
    whitePlayers?: Player[];
    bluePlayers?: Player[];
    whiteScore?: number;
    blueScore?: number;
    whiteHandicap?: number;
    blueHandicap?: number;
    whiteStats?: HoleStats[];
    blueStats?: HoleStats[];
  }> = [];

  constructor(private readonly foursomeService: FoursomeService, private readonly cdr: ChangeDetectorRef) {
    const day = this.selectedDay == 2 ? 2 : 1; 
    this.holes =  FIELD_INFO_2026[day];
  }

  ngOnInit(): void {
    this.loadDayFoursomes();
  }

  selectDay(day: number): void {
    this.selectedDay = day;
    this.selectedTeamId = '';
    this.duoList = [];
    localStorage.setItem(this.dayStorageKey, String(day));
    this.loadDayFoursomes();
  }

  private getStoredDay(): number {
    const savedDay = Number(localStorage.getItem(this.dayStorageKey));
    return savedDay === 1 || savedDay === 2 ? savedDay : 1;
  }

  private loadDayFoursomes(): void {
    this.selectedTeamId = '';
    this.duoList = [];

    this.foursomeService.getFoursomeByDay(this.selectedDay).subscribe({
      next: (foursomes) => {
        this.foursomes = foursomes ?? [];
        this.duoList = this.foursomes.flatMap((foursome) => {
          const whiteDuo = this.buildDuoFromTeam(
            foursome.id ?? 0,
            foursome.whitePlayers ?? [],
            TeamEnum.WHITE,
            foursome.whiteStats ?? [],
            foursome.whiteScore ?? 0,
            foursome.whiteHandicap ?? 0,
          );

          const blueDuo = this.buildDuoFromTeam(
            foursome.id ?? 0,
            foursome.bluePlayers ?? [],
            TeamEnum.BLUE,
            foursome.blueStats ?? [],
            foursome.blueScore ?? 0,
            foursome.blueHandicap ?? 0,
          );

          return [
            { ...whiteDuo, name: `Duo ${whiteDuo.player1.name} et ${whiteDuo.player2.name}` },
            { ...blueDuo, name: `Duo ${blueDuo.player1.name} et ${blueDuo.player2.name}` },
          ];
        });

        this.selectedTeamId = this.duoList[0]?.id ?? '';
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error('Failed to load foursomes', err);
        this.foursomes = [];
        this.duoList = [];
        this.selectedTeamId = '';
        this.cdr.markForCheck();
      },
    });
  }

  get currentTeam(): ScoreDuo | undefined {
    return this.duoList.find((team) => team.id === this.selectedTeamId) ?? this.duoList[0];
  }

  get currentHole(): HoleInfo {
    return this.holes.find((hole) => hole.number === this.selectedHoleNum) ?? this.holes[0];
  }

  get currentScore(): number | null {
    return this.getCurrentHoleScore();
  }

  selectHole(holeNum: number): void {
    this.selectedHoleNum = holeNum;
  }

  prevHole(): void {
    if (this.selectedHoleNum > 1) {
      this.selectedHoleNum -= 1;
    }
  }

  nextHole(): void {
    if (this.selectedHoleNum < this.holes.length) {
      this.selectedHoleNum += 1;
    }
  }

  incrementScore(): void {
    const nextScore = (this.getCurrentHoleScore() ?? 0) + 1;
    this.setCurrentHoleScore(nextScore);
  }

  decrementScore(): void {
    const current = this.getCurrentHoleScore() ?? 0;
    if (current > 0) {
      this.setCurrentHoleScore(current - 1);
    }
  }

  clearScore(): void {
    this.setCurrentHoleScore(null);
  }

  get frontNineTotal(): number {
    return this.calculateSum(1, 9);
  }

  get backNineTotal(): number {
    return this.calculateSum(10, 18);
  }

  get totalScore(): number {
    return this.calculateSum(1, 18);
  }

  get toPar(): string {
    let totalParEntered = 0;
    let totalStrokes = 0;

    this.currentTeam?.stats.forEach((hole) => {
      const holeInfo = this.holes.find((item) => item.number === hole.holeNumber);
      if (!holeInfo) {
        return;
      }
      totalStrokes += Number(hole.score ?? 0);
      totalParEntered += holeInfo.par;
    });

    if (totalStrokes === 0) {
      return 'E';
    }

    const diff = totalStrokes - totalParEntered;
    if (diff > 0) return `+${diff}`;
    if (diff === 0) return 'E';
    return `${diff}`;
  }

  get scoreLabel(): string {
    const score = this.currentScore;
    if (score === null) return '';

    const diff = score - this.currentHole.par;
    if (score === 1) return 'Hole in One!';

    switch (diff) {
      case -3:
        return 'Albatross';
      case -2:
        return 'Eagle';
      case -1:
        return 'Birdie';
      case 0:
        return 'Par';
      case 1:
        return 'Bogey';
      case 2:
        return 'Double Bogey';
      case 3:
        return 'Triple Bogey';
      default:
        return diff > 0 ? `+${diff}` : `${diff}`;
    }
  }

  private getCurrentHoleScore(): number | null {
    const team = this.currentTeam;
    if (!team) {
      return null;
    }

    return team.stats.find((hole) => hole.holeNumber === this.selectedHoleNum)?.score ?? null;
  }

  private setCurrentHoleScore(score: number | null): void {
    const team = this.currentTeam;
    if (!team) {
      return;
    }

    const nextStats = [...team.stats];
    const holeIndex = nextStats.findIndex((hole) => hole.holeNumber === this.selectedHoleNum);
    const nextHole: HoleStats = {
      holeNumber: this.selectedHoleNum,
      isPar3: this.currentHole.par === 3,
      driveTakenBy: '',
      hasHitInFairway: false,
      hasHitInHazard: false,
      nbrOfPutt: 0,
      score: score ?? 0,
    };

    if (holeIndex >= 0) {
      nextStats[holeIndex] = { ...nextStats[holeIndex], ...nextHole };
    } else {
      nextStats.push(nextHole);
    }

    team.stats = nextStats;
    team.lastHole = this.getFallbackHoleStats(nextStats);
    team.totalScore = nextStats.reduce((sum, hole) => sum + Number(hole.score ?? 0), 0) + team.handicap;

    const foursomeIndex = this.foursomes.findIndex((foursome) => (foursome.id ?? 0) === team.foursomeId);
    if (foursomeIndex >= 0) {
      const foursome = this.foursomes[foursomeIndex];
      const isWhite = team.teamColor === TeamEnum.WHITE;
      const statsKey = isWhite ? 'whiteStats' : 'blueStats';
      const scoreKey = isWhite ? 'whiteScore' : 'blueScore';
      const handicapKey = isWhite ? 'whiteHandicap' : 'blueHandicap';

      const nextFoursomeStats = [...(foursome[statsKey] ?? [])];
      const statIndex = nextFoursomeStats.findIndex((hole) => hole.holeNumber === this.selectedHoleNum);
      if (statIndex >= 0) {
        nextFoursomeStats[statIndex] = { ...nextFoursomeStats[statIndex], ...nextHole };
      } else {
        nextFoursomeStats.push(nextHole);
      }

      foursome[statsKey] = nextFoursomeStats;
      const total = nextFoursomeStats.reduce((sum, hole) => sum + Number(hole.score ?? 0), 0);
      foursome[scoreKey] = total ;//+ Number(foursome[handicapKey] ?? 0);

      this.foursomeService.saveFoursomesForDay(this.selectedDay, this.foursomes).subscribe({
        next: () => undefined,
        error: (error) => console.error('Failed to save score update', error),
      });
    }
  }

  private calculateSum(startHole: number, endHole: number): number {
    const team = this.currentTeam;
    if (!team) {
      return 0;
    }

    return team.stats
      .filter((hole) => hole.holeNumber >= startHole && hole.holeNumber <= endHole)
      .reduce((sum, hole) => sum + Number(hole.score ?? 0), 0);
  }

  private buildDuoFromTeam(
    foursomeId: number,
    teamPlayers: Player[],
    teamColor: TeamEnum,
    stats: HoleStats[] = [],
    score: number = 0,
    handicap: number = 0,
  ): ScoreDuo {
    const player1 = teamPlayers[0] ?? { id: '', name: 'TBD', duoIds: [], driveTaken: 0, drivePar3Taken: 0 };
    const player2 = teamPlayers[1] ?? { id: '', name: 'TBD', duoIds: [], driveTaken: 0, drivePar3Taken: 0 };

    return {
      id: `${foursomeId}-${teamColor}`,
      foursomeId,
      player1,
      player2,
      teamColor,
      totalScore: score + handicap,
      adjustScore: handicap,
      handicap,
      lastHole: this.getFallbackHoleStats(stats),
      stats: stats ?? [],
      name: `${player1.name} et ${player2.name}`,
    };
  }

  private getFallbackHoleStats(stats: HoleStats[] = []): HoleStats {
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
}