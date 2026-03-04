"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TicketController = void 0;
const express_1 = require("express");
const prisma_1 = require("../prisma");
class TicketController {
    static async listByUser(req, res) {
        try {
            const userId = req.user.id;
            const tickets = await prisma_1.prisma.ticket.findMany({
                where: { order: { userId } },
                include: {
                    order: {
                        include: { championship: true }
                    }
                }
            });
            res.json(tickets);
        }
        catch (e) {
            res.status(500).json({ error: 'Erro ao listar tickets' });
        }
    }
    static async validate(req, res) {
        try {
            const { uuid } = req.body;
            const ticket = await prisma_1.prisma.ticket.findUnique({
                where: { uuid },
                include: { order: { include: { championship: true, user: true } } }
            });
            if (!ticket)
                return res.status(404).json({ error: 'TICKET INVÁLIDO' });
            if (ticket.status === 'USED')
                return res.status(400).json({ error: 'TICKET JÁ UTILIZADO' });
            const updated = await prisma_1.prisma.ticket.update({
                where: { id: ticket.id },
                data: { status: 'USED', validatedAt: new Date() }
            });
            res.json({ message: 'ACESSO LIBERADO', ticket: updated });
        }
        catch (e) {
            res.status(500).json({ error: 'Erro ao validar ticket' });
        }
    }
}
exports.TicketController = TicketController;
//# sourceMappingURL=TicketController.js.map