import { Request, Response } from 'express';
export declare class TicketController {
    static listByUser(req: Request, res: Response): Promise<void>;
    static validate(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
}
//# sourceMappingURL=TicketController.d.ts.map