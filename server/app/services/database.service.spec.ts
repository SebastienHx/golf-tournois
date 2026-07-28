// import { expect } from 'chai';
// import { SinonStub, stub } from 'sinon';
// import { DatabaseService } from './database.service'; // Update the path accordingly

// describe('DatabaseService', () => {
//     let dbService: DatabaseService;
//     let connectStub: SinonStub;

//     beforeEach(() => {
//         dbService = new DatabaseService();
//         connectStub = stub(dbService, 'connectToServer');
//     });

//     it('should connect to the MongoDB server successfully', async () => {
//         connectStub.resolves();

//         await dbService.connectToServer('mocked-db-url');

//         expect(connectStub.calledOnce).to.be.true;
//     });

//     it('should handle errors during connection to the MongoDB server', async () => {
//         const errorMessage = 'Connection error';
//         connectStub.rejects(new Error(errorMessage));

//         await dbService.connectToServer('mocked-db-url');

//         expect(connectStub.calledOnce).to.be.true;
//     });
// });
