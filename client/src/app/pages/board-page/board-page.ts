import { Component, OnInit } from '@angular/core';
import { FoursomeComponent } from '@app/components/foursome/foursome';
import { Header } from '@app/components/header/header';
import { Leaderboard } from '@app/components/leaderboard/leaderboard';
import { PlayerDuoExamples } from '@app/constants/mock';
import { PlayerDuo } from '@app/interfaces/player';
import { TeamEnum } from '@app/interfaces/team';

@Component({
  selector: 'app-board-page',
  standalone: true,
  imports: [Header, Leaderboard, FoursomeComponent],
  templateUrl: './board-page.html',
  styleUrl: './board-page.scss',
})
export class BoardPage implements OnInit{

  leaderboardData: PlayerDuo[] = [];
  foursomes: Array<{ title: string; duo1: PlayerDuo; duo2: PlayerDuo }> = [];

  ngOnInit(): void {
    this.leaderboardData = [
      {
        id: '1',
        player1: { id: 'p1', name: 'Mike Brown', teamId: 't1', driveTaken: 0, drivePar3Taken: 0 },
        player2: { id: 'p2', name: 'Steve Clark', teamId: 't1', driveTaken: 0, drivePar3Taken: 0 },
        teamColor: TeamEnum.WHITE,
        totalScore: -5,
        adjustScore: 0,
        lastHole: { holeNumber: 10, isPar3: false, hitInFairway: true, hasHitInHazard: false, nbrOfPutt: 2, score: 4 },
        stats: [{ holeNumber: 1, isPar3: true, hitInFairway: true, hasHitInHazard: false, nbrOfPutt: 2, score: 4 },]
      },
      {
        id: '2',
        player1: { id: 'p3', name: 'James Miller', teamId: 't2', driveTaken: 0, drivePar3Taken: 0 },
        player2: { id: 'p4', name: 'Tom Harris', teamId: 't2', driveTaken: 0, drivePar3Taken: 0 },
        teamColor: TeamEnum.BLUE,
        totalScore: -4,
        adjustScore: 0,
        lastHole: { holeNumber: 9, isPar3: false, hitInFairway: true, hasHitInHazard: false, nbrOfPutt: 1, score: 3 },
        stats: []
      },
      {
        id: '3',
        player1: { id: 'p5', name: 'Chris Evans', teamId: 't1', driveTaken: 0, drivePar3Taken: 0 },
        player2: { id: 'p6', name: 'Dan Lewis', teamId: 't1', driveTaken: 0, drivePar3Taken: 0 },
        teamColor: TeamEnum.WHITE,
        totalScore: -1,
        adjustScore: 0,
        lastHole: { holeNumber: 12, isPar3: false, hitInFairway: true, hasHitInHazard: false, nbrOfPutt: 2, score: 4 },
        stats: []
      },
      {
        id: '4',
        player1: { id: 'p7', name: 'Ryan Scott', teamId: 't2', driveTaken: 0, drivePar3Taken: 0 },
        player2: { id: 'p8', name: 'Paul Walker', teamId: 't2', driveTaken: 0, drivePar3Taken: 0 },
        teamColor: TeamEnum.BLUE,
        totalScore: 6,
        adjustScore: 0,
        lastHole: { holeNumber: 9, isPar3: false, hitInFairway: false, hasHitInHazard: true, nbrOfPutt: 3, score: 6 },
        stats: []
      }
    ];

    this.foursomes = this.leaderboardData.reduce<Array<{ title: string; duo1: PlayerDuo; duo2: PlayerDuo }>>((acc, duo, index) => {
      if (index % 2 === 0) {
        const duo2 = this.leaderboardData[index + 1];
        if (duo2) {
          acc.push({
            title: `FOURSOME ${acc.length + 1}`,
            duo1: duo,
            duo2,
          });
        }
      }
      return acc;
    }, []);
  }
}
