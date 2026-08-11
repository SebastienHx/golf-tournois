import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FoursomeService } from '@app/services/foursome.service';
import { Player, PlayerDuo } from '@app/interfaces/player';
import { TeamEnum } from '@app/interfaces/team';
import { HoleStats } from '@app/interfaces/hole-stats';
import { RouterLink } from '@angular/router';

export interface LeaderboardEntry {
  duoName: string;
  player1: string;
  player2: string;
  statValue: string;
  numericVal: number;
  teamColor: TeamEnum;
  isWinner?: boolean; // Added to highlight winners in head-to-head matchups
}

export interface FoursomeMatchup {
  foursomeId: string | number;
  whiteDuo: LeaderboardEntry;
  blueDuo: LeaderboardEntry;
}

export interface ChallengeStats {
  blueTeamPoints: number;
  whiteTeamPoints: number;
  leastPutts: LeaderboardEntry[];
  mostHazards: LeaderboardEntry[];
  bestScoreMatchups: FoursomeMatchup[]; // Grouped by foursome match-up
  mostOnFairway: LeaderboardEntry[];
}

interface ProcessedDuo {
  foursomeId?: string | number;
  duoName: string;
  player1Name: string;
  player2Name: string;
  teamColor: TeamEnum;
  totalPutts: number;
  totalHazards: number;
  onFairwayCount: number;
  totalScore: number;
}

@Component({
  selector: 'app-admin-leaderboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './admin-leaderboard.html',
  styleUrls: ['./admin-leaderboard.scss']
})
export class AdminLeaderboardComponent implements OnInit {
  selectedDay: 1 | 2 = 1;
  isLoading: boolean = false;
  errorMessage: string | null = null;
  TeamEnum = TeamEnum;

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

    const allDuos: ProcessedDuo[] = [];
    const bestScoreMatchups: FoursomeMatchup[] = [];

    let bluePoints = 0;
    let whitePoints = 0;

    // 1. Extract duos & evaluate head-to-head match-ups per foursome
    foursomes.forEach((foursome, index) => {
      const fId = foursome.id ?? index + 1;
      
      const whiteDuo = this.extractDuoMetrics(
        foursome.whitePlayers, 
        foursome.whiteStats, 
        TeamEnum.WHITE, 
        foursome.whiteScore, 
        fId
      );
      
      const blueDuo = this.extractDuoMetrics(
        foursome.bluePlayers, 
        foursome.blueStats, 
        TeamEnum.BLUE, 
        foursome.blueScore, 
        fId
      );

      allDuos.push(whiteDuo, blueDuo);

      const whiteEntry = this.toLeaderboardEntry(whiteDuo, `${whiteDuo.totalScore}`, whiteDuo.totalScore);
      const blueEntry = this.toLeaderboardEntry(blueDuo, `${blueDuo.totalScore}`, blueDuo.totalScore);

      // Evaluate 3 Points per Foursome Matchup Winner (Ties award 3 pts to both)
      if (whiteDuo.totalScore < blueDuo.totalScore) {
        whitePoints += 3;
        whiteEntry.isWinner = true;
      } else if (blueDuo.totalScore < whiteDuo.totalScore) {
        bluePoints += 3;
        blueEntry.isWinner = true;
      } else {
        whitePoints += 3;
        bluePoints += 3;
        whiteEntry.isWinner = true;
        blueEntry.isWinner = true;
      }

      bestScoreMatchups.push({
        foursomeId: fId,
        whiteDuo: whiteEntry,
        blueDuo: blueEntry
      });
    });

    // 2. Process global stats for other categories
    const leastPutts = [...allDuos]
      .sort((a, b) => a.totalPutts - b.totalPutts)
      .map(d => this.toLeaderboardEntry(d, `${d.totalPutts} Putts`, d.totalPutts));

    const mostHazards = [...allDuos]
      .sort((a, b) => b.totalHazards - a.totalHazards)
      .map(d => this.toLeaderboardEntry(d, `${d.totalHazards} Eau/Sable`, d.totalHazards));

    const mostOnFairway = [...allDuos]
      .sort((a, b) => b.onFairwayCount - a.onFairwayCount)
      .map(d => this.toLeaderboardEntry(d, `${d.onFairwayCount} Coups`, d.onFairwayCount));

    // 3. Award 1 Point for category ties & winners
    const awardCategoryPoints = (entries: LeaderboardEntry[]) => {
      if (entries.length === 0) return;
      const topScore = entries[0].numericVal;
      entries.forEach(entry => {
        if (entry.numericVal === topScore) {
          if (entry.teamColor === TeamEnum.BLUE) bluePoints += 1;
          else if (entry.teamColor === TeamEnum.WHITE) whitePoints += 1;
        }
      });
    };

    awardCategoryPoints(leastPutts);
    awardCategoryPoints(mostHazards);
    awardCategoryPoints(mostOnFairway);

    return {
      blueTeamPoints: bluePoints,
      whiteTeamPoints: whitePoints,
      leastPutts,
      mostHazards,
      bestScoreMatchups,
      mostOnFairway
    };
  }

  private extractDuoMetrics(
    playersData: any, 
    statsData: HoleStats[], 
    teamColor: TeamEnum, 
    scoreOverride?: number, 
    foursomeId?: string | number
  ): ProcessedDuo {
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
      if (hole.hasHitInHazard) totalHazards += 1;
      if (!hole.isPar3 && hole.hasHitInFairway === true) onFairwayCount += 1;
      calculatedScore += hole.score || 0;
    });

    return {
      foursomeId,
      duoName,
      player1Name,
      player2Name,
      teamColor,
      totalPutts,
      totalHazards,
      onFairwayCount,
      totalScore: scoreOverride ?? calculatedScore
    };
  }

  private toLeaderboardEntry(d: ProcessedDuo, statValue: string, numericVal: number): LeaderboardEntry {
    return {
      duoName: d.duoName,
      player1: d.player1Name,
      player2: d.player2Name,
      statValue,
      numericVal,
      teamColor: d.teamColor
    };
  }

  private getEmptyStats(): ChallengeStats {
    return {
      blueTeamPoints: 0,
      whiteTeamPoints: 0,
      leastPutts: [],
      mostHazards: [],
      bestScoreMatchups: [],
      mostOnFairway: []
    };
  }
}