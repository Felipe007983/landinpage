import { Request, Response } from 'express';
export declare class ChampionshipController {
    static list(req: Request, res: Response): Promise<void>;
    static getById(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    static create(req: Request, res: Response): Promise<void>;
}
//# sourceMappingURL=ChampionshipController.d.ts.map