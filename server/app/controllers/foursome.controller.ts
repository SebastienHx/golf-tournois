import { FoursomeService } from '@app/services/foursome.service';
import { Request, Response, Router } from 'express';
import { Service } from 'typedi';
// eslint-disable-next-line no-restricted-imports, import/no-unresolved
import { StatusCodes } from 'http-status-codes';

@Service()
export class FoursomeController {
    router!: Router;

    constructor(private readonly foursomeService: FoursomeService) {
        this.configureRouter();
    }

    private configureRouter(): void {
        this.router = Router();

        this.router.get('/day/:day', async (req: Request, res: Response) => {
            try {
                const day = Number(req.params.day);
                const foursomes = await this.foursomeService.getFoursomesByDay(day);
                res.json(foursomes);
            } catch (error: unknown) {
                const message = error instanceof Error ? error.message : 'Internal Server Error';
                const errorMessage = {
                    title: 'Error',
                    body: message,
                };
                res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(errorMessage);
            }
        });

        this.router.post('/day/:day', async (req: Request, res: Response) => {
            try {
                const day = Number(req.params.day);
                const foursome = req.body;
                const updatedDay = await this.foursomeService.addFoursome(day, foursome);
                res.status(StatusCodes.CREATED).json(updatedDay);
            } catch (error: unknown) {
                const message = error instanceof Error ? error.message : 'Internal Server Error';
                const errorMessage = {
                    title: 'Error',
                    body: message,
                };
                res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(errorMessage);
            }
        });

        this.router.put('/day/:day', async (req: Request, res: Response) => {
            try {
                const day = Number(req.params.day);
                const foursomes = req.body?.foursomes ?? [];
                const updatedDay = await this.foursomeService.saveDayFoursomes(day, foursomes);
                res.status(StatusCodes.OK).json(updatedDay);
            } catch (error: unknown) {
                const message = error instanceof Error ? error.message : 'Internal Server Error';
                const errorMessage = {
                    title: 'Error',
                    body: message,
                };
                res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(errorMessage);
            }
        });

        this.router.put('/day/:day/:foursomeId', async (req: Request, res: Response) => {
            try {
                const day = Number(req.params.day);
                const foursomeId = Number(req.params.foursomeId);
                const updatedFoursome = req.body;
                const updatedDay = await this.foursomeService.modifyFoursome(day, foursomeId, updatedFoursome);
                res.status(StatusCodes.OK).json(updatedDay);
            } catch (error: unknown) {
                const message = error instanceof Error ? error.message : 'Internal Server Error';
                const errorMessage = {
                    title: 'Error',
                    body: message,
                };
                res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(errorMessage);
            }
        });

        this.router.delete('/day/:day/:foursomeId', async (req: Request, res: Response) => {
            try {
                const day = Number(req.params.day);
                const foursomeId = Number(req.params.foursomeId);
                const updatedDay = await this.foursomeService.removeFoursome(day, foursomeId);
                res.status(StatusCodes.OK).json(updatedDay);
            } catch (error: unknown) {
                const message = error instanceof Error ? error.message : 'Internal Server Error';
                const errorMessage = {
                    title: 'Error',
                    body: message,
                };
                res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(errorMessage);
            }
        });

        //Deletes all tournament score data
        this.router.delete('/day', async (req: Request, res: Response) => {
            try {
                await this.foursomeService.resetAllScores();
                res.status(StatusCodes.OK).json();
            } catch (error: unknown) {
                const message = error instanceof Error ? error.message : 'Internal Server Error';
                const errorMessage = {
                    title: 'Error',
                    body: message,
                };
                res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(errorMessage);
            }
        });
    }
}
