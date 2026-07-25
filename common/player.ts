import { Stats } from './stats';
import { Team } from './team';

export interface PlayerDuo {
    stats: Stats[];
    drive0: number;
    drive1: number;
    drive0Par3: number;
    drive1Par3: number;
    totalScore: number;
    team: Team;
    names: string[];
    adjustScore: number;
    id: string;
}
