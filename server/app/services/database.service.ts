import * as path from 'path';
import { Db, MongoClient, ServerApiVersion } from 'mongodb';
import * as dotenv from 'dotenv';
import { Service } from 'typedi';

dotenv.config({
    path: path.join(process.cwd(), '.env'),
});

export const DB_CONSTS = {
    DB_DB: process.env.DB_DB ?? '',
    DB_COLLECTION: process.env.DB_COLLECTION ?? '',
    DB_COLLECTION_PLAYERS: process.env.DB_COLLECTION_PLAYERS ?? '', 
    DB_URL: process.env.DB_URL ?? '',
};

@Service()
export class DatabaseService {
    db: Db | undefined;
    private client: MongoClient | undefined;

    async connectToServer(uri: string) {
        try {

            this.client = new MongoClient(uri, {
                serverApi: {
                    version: ServerApiVersion.v1,
                    strict: true,
                    deprecationErrors: true,
                },
            });

            await this.client.connect();
            this.db = this.client.db(DB_CONSTS.DB_DB);
            console.log('Successfully connected to MongoDB.');
        } catch (err) {
            console.error(err);
        }
    }
}

const dbService = new DatabaseService();
dbService.connectToServer(DB_CONSTS.DB_URL);
export { dbService };
