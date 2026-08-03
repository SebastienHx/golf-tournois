import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HoleStats } from '@app/interfaces/hole-stats';
import { Player, PlayerDuo } from '@app/interfaces/player';

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

// import { environment } from 'src/environments/environment'; //TODO: ADD ENV FILE
@Injectable({
    providedIn: 'root',
})

export class FoursomeService {
    // private readonly url = `${environment.serverUrl}/player`;
    private readonly url = `http://localhost:3000/api/foursome/day`;

    constructor(private readonly http: HttpClient) {}
    getFoursomeByDay(day: number) {
        return this.http.get<SavedFoursome[]>(`${this.url}/${day}`);
    }

    saveFoursomesForDay(day: number, foursomes: SavedFoursome[]) {
        return this.http.put(`${this.url}/${day}`, { foursomes });
    }

    getPlayerById(playerId: string) {
        return this.http.get<Player>(`${this.url}/${playerId}`);
    }

    // addPlayerStat(duoId: string, holeInfo: HoleStats) {
    //     return this.http.put<Player>(`${this.url}/${duoId}/stats`, holeInfo);
    // }
    addNewPlayer(playerInfo: any){
        return this.http.post<Player>(`${this.url}/new`, playerInfo);
    }

    deletePlayer(playerId: any){
        return this.http.delete<Player>(`${this.url}/${playerId}`);
    }

    populateDatabase() {
        return this.http.post<Player>(`${this.url}`, {});
    }

    // deleteQuestion(questionId: string): Observable<PlayerDuo> {
    //     return this.http.delete<PlayerDuo>(`${this.url}/${questionId}`);
    // }
}
// async retrieveAllPlayers(): Promise<unknown[]> {
//     return await this.collection.find({}).toArray();
// }

// async getPlayerDuoById(id: string): Promise<unknown | null> {
//     return await this.collection.findOne({ id });
// }

// async modifyPlayer(id: string, updatedPlayerData: unknown): Promise<unknown> {
//     await this.collection.updateOne({ id }, { $set: updatedPlayerData });
//     return await this.collection.findOne({ id });
// }

// async addHoleInfo(id: string, holeInfo: unknown): Promise<unknown> {
//     await this.collection.updateOne({ id }, { $push: { stats: holeInfo } });
//     return await this.collection.findOne({ id });
// }