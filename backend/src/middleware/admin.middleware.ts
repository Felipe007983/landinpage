import { Request, Response, NextFunction } from 'express';
import { prisma } from '../prisma';

export const adminMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = (req as any).user?.id;
        if (!userId) return res.status(401).json({ error: 'Não autorizado' });

        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (!user || user.role !== 'ADMIN') {
            return res.status(403).json({ error: 'Acesso negado: Requer privilégios de administrador' });
        }

        next();
    } catch (e) {
        res.status(500).json({ error: 'Erro ao validar privilégios' });
    }
};
