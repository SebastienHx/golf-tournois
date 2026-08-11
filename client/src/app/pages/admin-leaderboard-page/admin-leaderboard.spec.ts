import { of } from 'rxjs';
import { AdminLeaderboardComponent } from './admin-leaderboard';
import { TeamEnum } from '@app/interfaces/team';

describe('AdminLeaderboardComponent', () => {
  it('should calculate least putts from actual duo data', () => {
    const component = new AdminLeaderboardComponent({
      getFoursomeByDay: () => of([]),
    } as any);

    const duoA = {
      id: 'white-1',
      teamColor: TeamEnum.WHITE,
      player1: { id: 'p1', name: 'Alice', duoIds: [], driveTakenDay1: 0, drivePar3TakenDay1: 0, driveTakenDay2: 0, drivePar3TakenDay2: 0 },
      player2: { id: 'p2', name: 'Bob', duoIds: [], driveTakenDay1: 0, drivePar3TakenDay1: 0, driveTakenDay2: 0, drivePar3TakenDay2: 0 },
      totalScore: 0,
      adjustScore: 0,
      handicap: 0,
      lastHole: { holeNumber: 1, isPar3: false, hasHitInFairway: true, hasHitInHazard: false, nbrOfPutt: 2, score: 4, driveTakenBy: 'p1' },
      stats: [
        { holeNumber: 1, isPar3: false, hasHitInFairway: true, hasHitInHazard: false, nbrOfPutt: 2, score: 4, driveTakenBy: 'p1' },
        { holeNumber: 2, isPar3: false, hasHitInFairway: false, hasHitInHazard: true, nbrOfPutt: 3, score: 5, driveTakenBy: 'p2' },
      ],
    } as any;

    const duoB = {
      id: 'blue-1',
      teamColor: TeamEnum.BLUE,
      player1: { id: 'p3', name: 'Carol', duoIds: [], driveTakenDay1: 0, drivePar3TakenDay1: 0, driveTakenDay2: 0, drivePar3TakenDay2: 0 },
      player2: { id: 'p4', name: 'Dan', duoIds: [], driveTakenDay1: 0, drivePar3TakenDay1: 0, driveTakenDay2: 0, drivePar3TakenDay2: 0 },
      totalScore: 0,
      adjustScore: 0,
      handicap: 0,
      lastHole: { holeNumber: 1, isPar3: false, hasHitInFairway: true, hasHitInHazard: false, nbrOfPutt: 2, score: 4, driveTakenBy: 'p3' },
      stats: [
        { holeNumber: 1, isPar3: false, hasHitInFairway: true, hasHitInHazard: false, nbrOfPutt: 2, score: 4, driveTakenBy: 'p3' },
        { holeNumber: 2, isPar3: false, hasHitInFairway: true, hasHitInHazard: false, nbrOfPutt: 1, score: 4, driveTakenBy: 'p4' },
      ],
    } as any;

    const entries = (component as any).calculateLeastPutts([duoA, duoB]);

    expect(entries).toEqual([
      {
        duoName: 'Carol & Dan',
        player1: 'Carol',
        player2: 'Dan',
        statValue: 3,
      },
      {
        duoName: 'Alice & Bob',
        player1: 'Alice',
        player2: 'Bob',
        statValue: 5,
      },
    ]);
  });
});
