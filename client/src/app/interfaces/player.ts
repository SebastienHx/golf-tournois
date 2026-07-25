import { HoleStats } from './hole-stats';
import { TeamEnum } from './team';

// 

export interface Player{
    id: string;
    name: string;
    teamId: string;
    driveTaken: number; //min 4 drive taken per player
    drivePar3Taken: number; //min 2 drive taken per player
}

export interface PlayerDuo {
    stats: HoleStats[];
    lastHole: HoleStats;
    player1: Player;
    player2: Player;
    totalScore: number; //TODO: +3 for victory per day, to sum  for final result
    teamColor: TeamEnum;
    adjustScore: number;
    id: string;
}

