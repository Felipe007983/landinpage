import { Request, Response } from 'express';
import { prisma } from '../prisma';

export class TicketController {
    static async listByUser(req: Request, res: Response) {
        try {
            const userId = (req as any).user.id;
            const tickets = await prisma.ticket.findMany({
                where: { order: { userId } },
                include: {
                    order: {
                        include: { championship: true }
                    }
                }
            });
            res.json(tickets);
        } catch (e) {
            res.status(500).json({ error: 'Erro ao listar tickets' });
        }
    }

    static async validate(req: Request, res: Response) {
        try {
            const { uuid } = req.body;
            const ticket = await prisma.ticket.findUnique({
                where: { uuid },
                include: { order: { include: { championship: true, user: true } } }
            });

            if (!ticket) return res.status(404).json({ error: 'TICKET INVÁLIDO' });
            if (ticket.status === 'USED') return res.status(400).json({ error: 'TICKET JÁ UTILIZADO' });

            const updated = await prisma.ticket.update({
                where: { id: ticket.id },
                data: { status: 'USED', validatedAt: new Date() }
            });

            res.json({ message: 'ACESSO LIBERADO', ticket: updated });
        } catch (e) {
            res.status(500).json({ error: 'Erro ao validar ticket' });
        }
    }
}
