import { Request, Response } from 'express';
import { prisma } from '../prisma';

export class AdminController {
    static async toggleChampionshipStatus(req: Request, res: Response) {
        try {
            const id = req.params.id as string;
            const champ = await prisma.championship.findUnique({ where: { id } });

            if (!champ) return res.status(404).json({ error: 'Campeonato não encontrado' });

            const newStatus = champ.status === 'OPEN' ? 'CLOSED' : 'OPEN';

            const updated = await prisma.championship.update({
                where: { id },
                data: { status: newStatus }
            });

            res.json(updated);
        } catch (e) {
            res.status(500).json({ error: 'Erro ao atualizar status' });
        }
    }

    static async listAllOrders(req: Request, res: Response) {
        try {
            const orders = await prisma.order.findMany({
                include: { user: true, championship: true },
                orderBy: { createdAt: 'desc' }
            });
            res.json(orders);
        } catch (e) {
            res.status(500).json({ error: 'Erro ao listar transações' });
        }
    }
}
