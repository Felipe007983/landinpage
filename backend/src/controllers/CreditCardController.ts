import { Request, Response } from 'express';
import { prisma } from '../prisma';

export class CreditCardController {
    static async list(req: Request, res: Response) {
        try {
            const userId = (req as any).user?.id;
            if (!userId) return res.status(401).json({ error: 'Não autorizado' });

            const cards = await prisma.creditCard.findMany({
                where: { userId }
            });
            res.json(cards);
        } catch (e) {
            res.status(500).json({ error: 'Erro ao listar cartões' });
        }
    }

    static async create(req: Request, res: Response) {
        try {
            const userId = (req as any).user?.id;
            const { cardNumber, expiry, isDefault } = req.body;

            if (!userId) return res.status(401).json({ error: 'Não autorizado' });

            // Mock saving the credit card
            const maskedNumber = '****.****.****.' + cardNumber.slice(-4);
            const token = 'tok_mock_' + Math.random().toString(36).substring(7);

            // If this is set as default, remove default from others
            if (isDefault) {
                await prisma.creditCard.updateMany({
                    where: { userId },
                    data: { isDefault: false }
                });
            }

            const card = await prisma.creditCard.create({
                data: {
                    userId,
                    maskedNumber,
                    expiry,
                    token,
                    isDefault: isDefault || false
                }
            });

            res.json(card);
        } catch (e) {
            console.error(e);
            res.status(500).json({ error: 'Erro ao salvar cartão' });
        }
    }

    static async delete(req: Request, res: Response) {
        try {
            const userId = (req as any).user?.id;
            const cardId = req.params.id as string;

            if (!userId) return res.status(401).json({ error: 'Não autorizado' });

            await prisma.creditCard.delete({
                where: { id: cardId }
            });

            res.status(204).send();
        } catch (e) {
            res.status(500).json({ error: 'Erro ao deletar cartão' });
        }
    }
}
