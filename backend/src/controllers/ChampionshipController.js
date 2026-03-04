"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChampionshipController = void 0;
const express_1 = require("express");
const prisma_1 = require("../prisma");
class ChampionshipController {
    static async list(req, res) {
        try {
            const champs = await prisma_1.prisma.championship.findMany({
                orderBy: { date: 'asc' }
            });
            res.json(champs);
        }
        catch (e) {
            res.status(500).json({ error: 'Erro ao listar campeonatos' });
        }
    }
    static async getById(req, res) {
        try {
            const champ = await prisma_1.prisma.championship.findUnique({
                where: { id: req.params.id }
            });
            if (!champ)
                return res.status(404).json({ error: 'Campeonato não encontrado' });
            res.json(champ);
        }
        catch (e) {
            res.status(500).json({ error: 'Erro ao buscar campeonato' });
        }
    }
    // Admin rotas (mock simples para seed)
    static async create(req, res) {
        try {
            const champ = await prisma_1.prisma.championship.create({ data: req.body });
            res.json(champ);
        }
        catch (e) {
            res.status(500).json({ error: 'Erro ao criar campeonato' });
        }
    }
}
exports.ChampionshipController = ChampionshipController;
//# sourceMappingURL=ChampionshipController.js.map