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

    async getFoursomesByDay(day: number): Promise<any[]> {
        const document = await this.collection.findOne({ day });
        return document?.foursomes ?? [];
    }

    async saveDayFoursomes(day: number, foursomes: any[]): Promise<any> {
        const result = await this.collection.updateOne(
            { day },
            {
                $set: {
                    day,
                    foursomes,
                    updatedAt: new Date(),
                },
            },
            { upsert: true },
        );

        return {
            _id: result.upsertedId ?? undefined,
            day,
            foursomes,
        };
    }

    async addFoursome(day: number, foursome: any): Promise<any> {
        const document = await this.collection.findOne({ day });
        const foursomes = document?.foursomes ?? [];
        const nextFoursomes = [...foursomes, foursome];
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
            foursome.id === foursomeId ? { ...foursome, ...updatedFoursome } : foursome,
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

        await this.collection.updateOne(
            { day },
            { $set: { day, foursomes: nextFoursomes, updatedAt: new Date() } },
            { upsert: true },
        );

        return { day, foursomes: nextFoursomes };
    }
}
