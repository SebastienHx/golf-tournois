import { Collection } from 'mongodb';
import { Service } from 'typedi';
import { DB_CONSTS, dbService } from './database.service';

@Service()
export class FoursomeService {
    private dbService = dbService;

    private get collection(): Collection {
        if (!this.dbService) {
            throw new Error('Database 1 connection not initialized');
        }
        if (!this.dbService.db) {
            throw new Error('Database 2 not initialized');
        }
        return this.dbService.db.collection(DB_CONSTS.DB_COLLECTION);
    }

    private normalizeFoursome(foursome: any): any {
        return {
            ...foursome,
            whiteScore: Number(foursome?.whiteScore ?? 0),
            blueScore: Number(foursome?.blueScore ?? 0),
            whiteHandicap: Number(foursome?.whiteHandicap ?? 0),
            blueHandicap: Number(foursome?.blueHandicap ?? 0),
        };
    }

    async getFoursomesByDay(day: number): Promise<any[]> {
        const document = await this.collection.findOne({ day });
        return (document?.foursomes ?? []).map((foursome: any) => this.normalizeFoursome(foursome));
    }

    async saveDayFoursomes(day: number, foursomes: any[]): Promise<any> {
        const normalizedFoursomes = foursomes.map((foursome) => this.normalizeFoursome(foursome));

        const result = await this.collection.updateOne(
            { day },
            {
                $set: {
                    day,
                    foursomes: normalizedFoursomes,
                    updatedAt: new Date(),
                },
            },
            { upsert: true },
        );

        return {
            _id: result.upsertedId ?? undefined,
            day,
            foursomes: normalizedFoursomes,
        };
    }

    async addFoursome(day: number, foursome: any): Promise<any> {
        const document = await this.collection.findOne({ day });
        const foursomes = document?.foursomes ?? [];
        const normalizedFoursome = this.normalizeFoursome(foursome);
        const nextFoursomes = [...foursomes, normalizedFoursome];
        await this.collection.updateOne(
            { day },
            { $set: { day, foursomes: nextFoursomes, updatedAt: new Date() } },
            { upsert: true },
        );

        return { day, foursomes: nextFoursomes };
    }

    async modifyFoursome(day: number, foursomeId: number, updatedFoursome: any): Promise<any> {
        const document = await this.collection.findOne({ day });
        const foursomes = document?.foursomes ?? [];
        const nextFoursomes = foursomes.map((foursome: any) =>
            foursome.id === foursomeId
                ? this.normalizeFoursome({ ...foursome, ...updatedFoursome })
                : foursome,
        );

        await this.collection.updateOne(
            { day },
            { $set: { day, foursomes: nextFoursomes, updatedAt: new Date() } },
            { upsert: true },
        );

        return { day, foursomes: nextFoursomes };
    }

    // Atomically updates a single team of a single foursome, so concurrent score entries
    // from other teams are never overwritten by a stale copy of the whole day.
    async saveTeamResult(
        day: number,
        foursomeId: number,
        team: 'white' | 'blue',
        result: { stats: any[]; score: number; players?: any[] },
    ): Promise<boolean> {
        const update: Record<string, unknown> = {
            [`foursomes.$.${team}Stats`]: result.stats,
            [`foursomes.$.${team}Score`]: Number(result.score ?? 0),
            updatedAt: new Date(),
        };
        if (Array.isArray(result.players)) {
            update[`foursomes.$.${team}Players`] = result.players;
        }

        const updateResult = await this.collection.updateOne({ day, 'foursomes.id': foursomeId }, { $set: update });
        return updateResult.matchedCount > 0;
    }

    async removeFoursome(day: number, foursomeId: number): Promise<any> {
        const document = await this.collection.findOne({ day });
        const foursomes = document?.foursomes ?? [];
        const nextFoursomes = foursomes.filter((foursome: any) => foursome.id !== foursomeId);

        if (nextFoursomes.length === 0) {
            await this.collection.deleteOne({ day });
            return { day, foursomes: [] };
        }

        await this.collection.updateOne(
            { day },
            { $set: { day, foursomes: nextFoursomes, updatedAt: new Date() } },
            { upsert: true },
        );

        return { day, foursomes: nextFoursomes };
    }

    async resetAllScores(): Promise<void> {
      await this.collection.updateMany(
        { day: { $in: [1, 2] } }, // Targets both day 1 and day 2 documents
        {
          $set: {
            // Resets scores and empties stats for ALL foursomes on both days
            'foursomes.$[].whiteScore': 0,
            'foursomes.$[].blueScore': 0,
            'foursomes.$[].whiteStats': [],
            'foursomes.$[].blueStats': [],

            // Resets player drive counters across all foursomes
            'foursomes.$[].whitePlayers.$[].driveTakenDay1': 0,
            'foursomes.$[].whitePlayers.$[].drivePar3TakenDay1': 0,
            'foursomes.$[].whitePlayers.$[].driveTakenDay2': 0,
            'foursomes.$[].whitePlayers.$[].drivePar3TakenDay2': 0,

            'foursomes.$[].bluePlayers.$[].driveTakenDay1': 0,
            'foursomes.$[].bluePlayers.$[].drivePar3TakenDay1': 0,
            'foursomes.$[].bluePlayers.$[].driveTakenDay2': 0,
            'foursomes.$[].bluePlayers.$[].drivePar3TakenDay2': 0,

            updatedAt: new Date()
          }
        }
      );
      return;
    }
}
