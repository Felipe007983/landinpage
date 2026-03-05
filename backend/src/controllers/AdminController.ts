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

    static async updateChampionship(req: Request, res: Response) {
        try {
            const id = req.params.id as string;
            const data = req.body;

            const champ = await prisma.championship.update({
                where: { id },
                data
            });

            res.json(champ);
        } catch (e) {
            res.status(500).json({ error: 'Erro ao atualizar campeonato' });
        }
    }

    static async deleteChampionship(req: Request, res: Response) {
        try {
            const id = req.params.id as string;

            // Check if there are orders related to this championship
            const orders = await prisma.order.findFirst({ where: { championshipId: id } });
            if (orders) {
                return res.status(400).json({ error: 'Não é possível excluir um campeonato que já possui vendas registradas.' });
            }

            await prisma.championship.delete({
                where: { id }
            });

            res.json({ message: 'Campeonato excluído com sucesso' });
        } catch (e) {
            res.status(500).json({ error: 'Erro ao excluir campeonato' });
        }
    }
}
