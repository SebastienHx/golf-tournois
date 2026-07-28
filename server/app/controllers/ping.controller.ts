import { Request, Response, Router } from 'express';
import { Service } from 'typedi';
// eslint-disable-next-line no-restricted-imports, import/no-unresolved
@Service()
export class PingController {
    router: Router;

    constructor() {
        this.configureRouter();
    }

    private configureRouter(): void {
        this.router = Router();

        // get all players
        this.router.get('/', async (req: Request, res: Response) => {
            res.json('pong');
            return;
        });
    }
}
