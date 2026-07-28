export interface HoleStats {
    holeNumber: number;
    isPar3: boolean;
    driveTakenBy: string; //Player id whom drive was taken
    hasHitInFairway: boolean; // Highest per duo also gives point to team +1
    hasHitInHazard: boolean;  // Highest per duo, also gives point to team +1
    nbrOfPutt: number; // Least amount of putts, per duo. (also gives point to team)
    score: number; //score
}