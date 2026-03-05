"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TicketController = void 0;
const prisma_1 = require("../prisma");
const pdf_service_1 = require("../services/pdf.service");
class TicketController {
    static listByUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.user.id;
                const tickets = yield prisma_1.prisma.ticket.findMany({
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
        });
    }
    static validate(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { uuid } = req.body;
                const ticket = yield prisma_1.prisma.ticket.findUnique({
                    where: { uuid },
                    include: { order: { include: { championship: true, user: true } } }
                });
                if (!ticket)
                    return res.status(404).json({ error: 'TICKET INVÁLIDO' });
                if (ticket.status === 'USED')
                    return res.status(400).json({ error: 'TICKET JÁ UTILIZADO' });
                const updated = yield prisma_1.prisma.ticket.update({
                    where: { id: ticket.id },
                    data: { status: 'USED', validatedAt: new Date() }
                });
                res.json({ message: 'ACESSO LIBERADO', ticket: updated });
            }
            catch (e) {
                res.status(500).json({ error: 'Erro ao validar ticket' });
            }
        });
    }
    static downloadPdf(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.user.id;
                const ticketId = req.params.id;
                const ticket = yield prisma_1.prisma.ticket.findUnique({
                    where: { id: ticketId },
                    include: {
                        order: {
                            include: {
                                user: true,
                                championship: true
                            }
                        }
                    }
                });
                if (!ticket)
                    return res.status(404).json({ error: 'TICKET INVÁLIDO' });
                const ticketWithOrder = ticket;
                // Verifica se o ticket pertence ao usuário (ou se é ADMIN, mas vamos focar no usuário por agora)
                if (ticketWithOrder.order.userId !== userId && req.user.role !== 'ADMIN') {
                    return res.status(403).json({ error: 'NÃO AUTORIZADO' });
                }
                const { order } = ticketWithOrder;
                const { user, championship } = order;
                const ticketData = {
                    championshipName: championship.name,
                    ticketType: order.type === 'COMPETITOR' ? 'Competidor' : 'Espectador',
                    eventDate: championship.date,
                    eventLocation: championship.location,
                    userName: user.name,
                    purchaseDate: ticket.createdAt,
                    uuid: ticket.uuid
                };
                const pdfBuffer = yield pdf_service_1.PdfService.generateTicketPdf(ticketData);
                res.setHeader('Content-Type', 'application/pdf');
                res.setHeader('Content-Disposition', `attachment; filename="ingresso-${championship.name.replace(/\s+/g, '-').toLowerCase()}.pdf"`);
                res.send(pdfBuffer);
            }
            catch (error) {
                console.error('Erro ao gerar PDF do ticket:', error);
                res.status(500).json({ error: 'Erro ao gerar PDF do ticket' });
            }
        });
    }
}
exports.TicketController = TicketController;
