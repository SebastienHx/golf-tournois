import { expect } from 'chai';
import { PlayerService } from './player.service';

describe('PlayerService', () => {
    it('should create a new player and persist it', async () => {
        const service = new PlayerService();
        const insertedPlayer = { name: 'Alice', score: 42 };
        const collectionStub = {
            insertOne: async (doc: Record<string, unknown>) => ({ insertedId: 'generated-id' }),
            findOne: async (query: { id: string }) => ({ ...insertedPlayer, id: query.id }),
        };

        (service as unknown as { dbService: { db: { collection: () => typeof collectionStub } } }).dbService = {
            db: {
                collection: () => collectionStub,
            },
        };

        const createdPlayer = await service.addPlayer(insertedPlayer);

        expect(createdPlayer).to.deep.include({ name: 'Alice', score: 42 });
        expect((createdPlayer as { id?: string }).id).to.be.a('string');
    });
});
