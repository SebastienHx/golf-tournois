import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HoleStats } from '@app/interfaces/hole-stats';
import { Player, PlayerDuo } from '@app/interfaces/player';
import { environment } from '../../environments/environment';
@Injectable({
    providedIn: 'root',
})
export class PlayerService {
    // private readonly url = `${environment.serverUrl}/player`;
    // private readonly url = `${environment.apiUrl}/player`;
    private url = (import.meta as any).env['NG_APP_API_URL'];

    constructor(private readonly http: HttpClient) {}
    getAllPlayers() {
        return this.http.get<Player[]>(`${this.url}`);
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