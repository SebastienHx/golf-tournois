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
            whiteHolesStates: foursome.whiteHolesStates ?? [],
            blueHolesStates: foursome.blueHolesStates ?? [],
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
}
