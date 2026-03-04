import { Request, Response } from 'express';
import { prisma } from '../prisma';

export class ChampionshipController {
    static async list(req: Request, res: Response) {
        try {
            const champs = await prisma.championship.findMany({
                orderBy: { date: 'asc' }
            });
            res.json(champs);
        } catch (e) {
            res.status(500).json({ error: 'Erro ao listar campeonatos' });
        }
    }

    static async getById(req: Request, res: Response) {
        try {
            const champ = await prisma.championship.findUnique({
                where: { id: req.params.id as string }
            });
            if (!champ) return res.status(404).json({ error: 'Campeonato não encontrado' });
            res.json(champ);
        } catch (e) {
            res.status(500).json({ error: 'Erro ao buscar campeonato' });
        }
    }

    // Admin rotas (mock simples para seed)
    static async create(req: Request, res: Response) {
        try {
            const champ = await prisma.championship.create({ data: req.body });
            res.json(champ);
        } catch (e) {
            res.status(500).json({ error: 'Erro ao criar campeonato' });
        }
    }
}
