import { PlayerService } from '@app/services/player.service';
import { Request, Response, Router } from 'express';
import { Service } from 'typedi';
// eslint-disable-next-line no-restricted-imports, import/no-unresolved
import { StatusCodes } from 'http-status-codes';
@Service()
export class PlayerController {
    router: Router;

    constructor(private readonly playerService: PlayerService) {
        this.configureRouter();
    }
    // Route du controller
    // this.app.use('/api/player', this.playerController.router);
    // 
    private configureRouter(): void {
        this.router = Router();

        // popuplate the database
        // this.router.post('/', async (req: Request, res: Response) => {
        //     try {
        //         await this.playerService.populateDatabase(DATA2024c); //TO UPDATE TO CURRENT DATA SET
        //         res.send('Database populated');
        //         return;
        //     } catch (error) {
        //         const errorMessage = {
        //             title: 'Error',
        //             body: error.message || 'Internal Server Error',
        //         };
        //         res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(errorMessage);
        //     }
        // });

        // get all players
        this.router.get('/', async (req: Request, res: Response) => {
            try {
                const players = await this.playerService.retrieveAllPlayers();
                res.json(players);
                return;
            } catch (error) {
                const errorMessage = {
                    title: 'Error',
                    body: error.message || 'Internal Server Error',
                };
                res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(errorMessage);
            }
        });

        // get player by id
        this.router.get('/:id', async (req: Request, res: Response) => {
            try {
                const id = req.params.id;
                const player = await this.playerService.getPlayerDuoById(id);
                res.json(player);
            } catch (error) {
                const errorMessage = {
                    title: 'Error',
                    body: error.message || 'Internal Server Error',
                };
                res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(errorMessage);
            }
        });

        // add new player
        this.router.post('/new', async (req: Request, res: Response) => {
            try {
                const newPlayer = req.body;
                const addedPlayer = await this.playerService.addPlayer(newPlayer);
                res.status(StatusCodes.CREATED).json(addedPlayer);
            } catch (error) {
                const errorMessage = {
                    title: 'Error',
                    body: error.message || 'Internal Server Error',
                };
                res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(errorMessage);
            }
        });

        // modify player
        this.router.put('/:id', async (req: Request, res: Response) => {
            try {
                const id = req.params.id;
                const updatedPlayer = req.body;
                const modifiedPlayer = await this.playerService.modifyPlayer(id, updatedPlayer);
                res.json(modifiedPlayer);
            } catch (error) {
                const errorMessage = {
                    title: 'Error',
                    body: error.message || 'Internal Server Error',
                };
                res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(errorMessage);
            }
        });

        // delete a player
        this.router.delete('/:id', async (req: Request, res: Response) => {
            try {
                const id = req.params.id;
                const deletedPlayer = await this.playerService.deletePlayer(id);
                res.status(StatusCodes.OK).json(deletedPlayer);
            } catch (error) {
                const errorMessage = {
                    title: 'Error',
                    body: error.message || 'Internal Server Error',
                };
                res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(errorMessage);
            }
        });

        // add hole info
        // this.router.put('/:id/stats', async (req: Request, res: Response) => {
        //     try {
        //         const id = req.params.id;
        //         const holeInfo = req.body;
        //         const modifiedPlayerStats: any = await this.playerService.addHoleInfo(id, holeInfo);
        //         res.json(modifiedPlayerStats);
        //     } catch (error) {
        //         const errorMessage = {
        //             title: 'Error',
        //             body: error.message || 'Internal Server Error',
        //         };
        //         res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(errorMessage);
        //     }
        // });
    }
}
