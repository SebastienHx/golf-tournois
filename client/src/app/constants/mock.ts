import { HoleStats } from "@app/interfaces/hole-stats"
import { Player } from "@app/interfaces/player"
import { TeamEnum } from "@app/interfaces/team"

export const HoleStatsExamples:HoleStats[]  = [
    {
    holeNumber: 1,
    isPar3: true,
    hitInFairway: true,
    hasHitInHazard: false,
    nbrOfPutt: 2,
    score: 3
    },
    {
    holeNumber: 2,
    isPar3: false,
    hitInFairway: false,
    hasHitInHazard: true,
    nbrOfPutt: 1,
    score: 5
    }
]

export const Player1: Player = {
    id: "1",
    name: "Bob Tanguay",
    teamId: "1",
    driveTaken: 2,
    drivePar3Taken: 3,
}

export const Player2: Player = {
    id: "2",
    name: "Charles Tremblay",
    teamId: "1",
    driveTaken: 0,
    drivePar3Taken: 2,
}

export const PlayerDuoExamples = {
    stats: HoleStatsExamples,
    lastHole: HoleStatsExamples[1],
    player1: Player1,
    player2: Player2,
    totalScore: 9,
    teamColor: TeamEnum.BLUE,
    adjustScore: 3,
    id: "1"
}