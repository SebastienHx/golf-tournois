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
    
    async retrieveAllPlayers(): Promise<unknown[]> {
        return await this.collection.find({}).toArray();
    }

    async getPlayerDuoById(id: string): Promise<unknown | null> {
        return await this.collection.findOne({ id });
    }

    async modifyPlayer(id: string, updatedPlayerData: unknown): Promise<unknown> {
        await this.collection.updateOne({ id }, { $set: updatedPlayerData });
        return await this.collection.findOne({ id });
    }

    async deletePlayer(id: string): Promise<unknown> {
        return await this.collection.deleteOne({ id });
    }

    async addPlayer(newPlayerData: Record<string, unknown>): Promise<unknown> {
        const playerToInsert = {
            ...newPlayerData,
            id: typeof newPlayerData.id === 'string' && newPlayerData.id.length > 0 ? newPlayerData.id : `player-${Date.now()}`,
        };

        await this.collection.insertOne(playerToInsert);
        return await this.collection.findOne({ id: playerToInsert.id });
    }

    // async addHoleInfo(id: string, holeInfo: any): Promise<unknown> {
    //     const duo = await this.collection.findOne({ id });
    //     //if the hole already exists, update the stats
    //     if (duo && duo.stats.filter((stat: { hole: number }) => stat.hole === holeInfo.hole).length > 0) {
    //         duo.stats[holeInfo.hole - 1] = holeInfo;
    //         duo.totalScore = duo.stats.reduce((acc: any, stat: { score: number }) => acc + stat.score, 0);
    //         //Separate the drive stats for par 3 holes and for each duo's player
    //         const driver0 = duo.stats.reduce(
    //             (acc: { drive: number; drivePar3: number }, stat: any) => {
    //                 stat.isPar3 ? (acc.drivePar3 += stat.drive === 0 ? 1 : 0) : (acc.drive += stat.drive === 0 ? 1 : 0);
    //                 return acc;
    //             },
    //             { drive: 0, drivePar3: 0 },
    //         );
    //         const driver1 = duo.stats.reduce(
    //             (acc: { drive: number; drivePar3: number }, stat: any) => {
    //                 stat.isPar3 ? (acc.drivePar3 += stat.drive === 1 ? 1 : 0) : (acc.drive += stat.drive === 1 ? 1 : 0);
    //                 return acc;
    //             },
    //             { drive: 0, drivePar3: 0 },
    //         );

    //         await this.collection.updateOne(
    //             { id },
    //             {
    //                 $set: {
    //                     stats: duo.stats,
    //                     totalScore: duo.totalScore,
    //                     drive0: driver0.drive,
    //                     drive1: driver1.drive,
    //                     drive0Par3: driver0.drivePar3,
    //                     drive1Par3: driver1.drivePar3,
    //                 },
    //             },
    //         );
    //     } else {
    //         //if new hole stats, add to the stats array
    //         if (holeInfo.isPar3) {
    //             holeInfo.drive === 0 ? (duo.drive0Par3 += 1) : (duo.drive1Par3 += 1);
    //         } else {
    //             holeInfo.drive === 0 ? (duo.drive0 += 1) : (duo.drive1 += 1);
    //         }
    //         duo.stats[holeInfo.hole - 1] = holeInfo;
    //         await this.collection.updateOne(
    //             { id },
    //             {
    //                 $set: {
    //                     stats: duo.stats,
    //                     totalScore: duo.totalScore + holeInfo.score,
    //                     drive0: duo.drive0,
    //                     drive1: duo.drive1,
    //                     drive0Par3: duo.drive0Par3,
    //                     drive1Par3: duo.drive1Par3,
    //                 },
    //             },
    //         );
    //     }
    //     return await this.collection.findOne({ id });
    // }

    async populateDatabase(data: any): Promise<void> {
        await this.collection.deleteMany({}); //Prevents populating the database if there is no data
        await this.collection.insertMany(data);
    }
}
