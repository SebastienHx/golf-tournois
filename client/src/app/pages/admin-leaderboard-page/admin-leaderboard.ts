import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FoursomeService } from '@app/services/foursome.service';
import { Player, PlayerDuo } from '@app/interfaces/player';
import { HoleStats } from '@app/interfaces/hole-stats';

export interface LeaderboardEntry {
  duoName: string;
  player1: string;
  player2: string;
  statValue: string;
  numericVal: number;
}

export interface ChallengeStats {
  leastPutts: LeaderboardEntry[];
  mostHazards: LeaderboardEntry[];
  bestScore: LeaderboardEntry[];
  mostOnFairway: LeaderboardEntry[];
}

interface ProcessedDuo {
  duoName: string;
  player1Name: string;
  player2Name: string;
  totalPutts: number;
  totalHazards: number;
  onFairwayCount: number;
  totalScore: number;
}

@Component({
  selector: 'app-admin-leaderboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-leaderboard.html',
  styleUrls: ['./admin-leaderboard.scss']
})
export class AdminLeaderboardComponent implements OnInit {
  selectedDay: 1 | 2 = 1;
  isLoading: boolean = false;
  errorMessage: string | null = null;

  day1Stats: ChallengeStats = this.getEmptyStats();
  day2Stats: ChallengeStats = this.getEmptyStats();

  constructor(private foursomeService: FoursomeService, private readonly cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.loadAllDaysData();
  }

  setDay(day: 1 | 2): void {
    this.selectedDay = day;
  }

  get currentStats(): ChallengeStats {
    return this.selectedDay === 1 ? this.day1Stats : this.day2Stats;
  }

  loadAllDaysData(): void {
    this.isLoading = true;
    this.errorMessage = null;

    this.foursomeService.getFoursomeByDay(1).subscribe({
      next: (foursomesDay1) => {
        this.day1Stats = this.calculateChallengeStats(foursomesDay1);
        
        this.foursomeService.getFoursomeByDay(2).subscribe({
          next: (foursomesDay2) => {
            this.day2Stats = this.calculateChallengeStats(foursomesDay2);
            this.isLoading = false;
            this.cdr.markForCheck();
          },
          error: (err) => {
            console.error('Error fetching Day 2 data:', err);
            this.isLoading = false;
          }
        });
      },
      error: (err) => {
        console.error('Error fetching Day 1 data:', err);
        this.errorMessage = 'Failed to load leaderboard data.';
        this.isLoading = false;
      }
    });
  }

  private calculateChallengeStats(foursomes: any[]): ChallengeStats {
    if (!foursomes || foursomes.length === 0) {
      return this.getEmptyStats();
    }

    const duos: ProcessedDuo[] = [];

    foursomes.forEach((foursome) => {
      if (foursome.whitePlayers || foursome.whiteStats) {
        duos.push(this.extractDuoMetrics(foursome.whitePlayers, foursome.whiteStats, foursome.whiteScore));
      }
      if (foursome.bluePlayers || foursome.blueStats) {
        duos.push(this.extractDuoMetrics(foursome.bluePlayers, foursome.blueStats, foursome.blueScore));
      }
    });

    return {
      // 1. Least Putts: Sorted ASC (Lowest putts first)
      leastPutts: [...duos]
        .sort((a, b) => a.totalPutts - b.totalPutts)
        .map(d => ({
          duoName: d.duoName,
          player1: d.player1Name,
          player2: d.player2Name,
          statValue: `${d.totalPutts} Putts`,
          numericVal: d.totalPutts
        })),

      // 2. Most Hazards: Sorted DESC (Highest hazards first)
      mostHazards: [...duos]
        .sort((a, b) => b.totalHazards - a.totalHazards)
        .map(d => ({
          duoName: d.duoName,
          player1: d.player1Name,
          player2: d.player2Name,
          statValue: `${d.totalHazards} Hazards`,
          numericVal: d.totalHazards
        })),

      // 3. Best Score: Sorted ASC (Lowest stroke total first)
      bestScore: [...duos]
        .sort((a, b) => a.totalScore - b.totalScore)
        .map(d => ({
          duoName: d.duoName,
          player1: d.player1Name,
          player2: d.player2Name,
          statValue: `${d.totalScore}`,
          numericVal: d.totalScore
        })),

      // 4. Most On Fairway: Sorted DESC (Highest fairway hits first)
      mostOnFairway: [...duos]
        .sort((a, b) => b.onFairwayCount - a.onFairwayCount)
        .map(d => ({
          duoName: d.duoName,
          player1: d.player1Name,
          player2: d.player2Name,
          statValue: `${d.onFairwayCount} Hit`,
          numericVal: d.onFairwayCount
        }))
    };
  }

  private extractDuoMetrics(playersData: any, statsData: HoleStats[], scoreOverride?: number): ProcessedDuo {
    let player1Name = 'Player 1';
    let player2Name = 'Player 2';

    if (Array.isArray(playersData)) {
      player1Name = playersData[0]?.name || 'Player 1';
      player2Name = playersData[1]?.name || 'Player 2';
    } else if (playersData && typeof playersData === 'object') {
      player1Name = playersData.player1?.name || 'Player 1';
      player2Name = playersData.player2?.name || 'Player 2';
    }

    const duoName = `${player1Name} & ${player2Name}`;
    const holes: HoleStats[] = statsData || playersData?.stats || [];

    let totalPutts = 0;
    let totalHazards = 0;
    let onFairwayCount = 0;
    let calculatedScore = 0;

    holes.forEach((hole) => {
      totalPutts += hole.nbrOfPutt || 0;

      if (hole.hasHitInHazard) {
        totalHazards += 1;
      }

      // Count Fairway Hits (excluding Par 3s)
      if (!hole.isPar3 && hole.hasHitInFairway === true) {
        onFairwayCount += 1;
      }

      calculatedScore += hole.score || 0;
    });

    return {
      duoName,
      player1Name,
      player2Name,
      totalPutts,
      totalHazards,
      onFairwayCount,
      totalScore: scoreOverride ?? calculatedScore
    };
  }

  private getEmptyStats(): ChallengeStats {
    return {
      leastPutts: [],
      mostHazards: [],
      bestScore: [],
      mostOnFairway: []
    };
  }
}