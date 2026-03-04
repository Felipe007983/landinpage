"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderController = void 0;
const express_1 = require("express");
const prisma_1 = require("../prisma");
class OrderController {
    static async create(req, res) {
        try {
            const userId = req.user.id;
            const { championshipId, type } = req.body; // type = 'COMPETITOR' ou 'VISITOR'
            const champ = await prisma_1.prisma.championship.findUnique({ where: { id: championshipId } });
            if (!champ)
                return res.status(404).json({ error: 'Campeonato não encontrado' });
            const amount = type === 'COMPETITOR' ? champ.priceComp : champ.priceVis;
            // Cria a Order (simulando gateway)
            const order = await prisma_1.prisma.order.create({
                data: {
                    userId,
                    championshipId,
                    type,
                    amount,
                    paymentStatus: 'APPROVED' // Simulando aprovação imediata
                }
            });
            // Cria o Ticket automaticamente após aprovação
            const ticket = await prisma_1.prisma.ticket.create({
                data: {
                    orderId: order.id
                }
            });
            res.json({ message: 'Compra aprovada com sucesso', order, ticket });
        }
        catch (e) {
            console.error(e);
            res.status(500).json({ error: 'Erro ao processar compra' });
        }
    }
    static async listByUser(req, res) {
        try {
            const userId = req.user.id;
            const orders = await prisma_1.prisma.order.findMany({
                where: { userId },
                include: { championship: true, ticket: true }
            });
            res.json(orders);
        }
        catch (e) {
            res.status(500).json({ error: 'Erro ao buscar ordens' });
        }
    }
}
exports.OrderController = OrderController;
//# sourceMappingURL=OrderController.js.map