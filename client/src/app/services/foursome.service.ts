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
    private url = `${(import.meta as any).env['NG_APP_API_URL']}/foursome/day` ;
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


    addNewPlayer(playerInfo: any){
        return this.http.post<Player>(`${this.url}/new`, playerInfo);
    }

    deletePlayer(playerId: any){
        return this.http.delete<Player>(`${this.url}/${playerId}`);
    }

    populateDatabase() {
        return this.http.post<Player>(`${this.url}`, {});
    }

}
