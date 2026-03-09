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
exports.OrderController = void 0;
const prisma_1 = require("../prisma");
const ticket_service_1 = require("../services/ticket.service");
class OrderController {
    static create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
                const { championshipId, type, paymentMethod, creditCardId } = req.body;
                if (!userId) {
                    return res.status(401).json({ error: 'Não autorizado' });
                }
                const user = yield prisma_1.prisma.user.findUnique({ where: { id: userId } });
                if (!user)
                    return res.status(404).json({ error: 'Usuário não encontrado' });
                let amount = 0;
                let includesFederation = false;
                const currentYear = new Date().getFullYear();
                const isFederated = user.federationYear === currentYear;
                const champ = championshipId ? yield prisma_1.prisma.championship.findUnique({ where: { id: championshipId } }) : null;
                if (type === 'FEDERATION') {
                    amount = champ ? champ.federationFee : 50;
                    includesFederation = true;
                }
                else {
                    if (!champ)
                        return res.status(404).json({ error: 'Campeonato não encontrado' });
                    amount = type === 'COMPETITOR' ? champ.priceComp : champ.priceVis;
                    if (type === 'COMPETITOR' && !isFederated) {
                        // Although the new flow blocks non-federated users from seeing the checkout for Competitor,
                        // we keep this fallback just in case some old state manages to reach here.
                        amount += champ.federationFee;
                        includesFederation = true;
                    }
                }
                let paymentStatus = 'PENDING';
                let gatewayResponse = {};
                // Se o valor for 0, aprova direto (gratuito)
                const amountVal = parseFloat((amount === null || amount === void 0 ? void 0 : amount.toString()) || '0');
                if (amountVal === 0) {
                    paymentStatus = 'APPROVED';
                    gatewayResponse = {
                        message: 'Ingresso gratuito emitido com sucesso.',
                        isFree: true
                    };
                }
                else if (paymentMethod === 'PIX' || paymentMethod === 'CREDIT_CARD' || paymentMethod === 'MERCADO_PAGO') {
                    // Para Mercado Pago Transparente, o pedido nasce PENDING e o frontend processa em seguida
                    paymentStatus = 'PENDING';
                    gatewayResponse = {
                        message: 'Pedido criado. Aguardando processamento do pagamento.'
                    };
                }
                else {
                    return res.status(400).json({ error: 'Método de pagamento não disponível.' });
                }
                // Verifica se o usuário já tem um pedido não-aprovado para este mesmo contexto
                let order = yield prisma_1.prisma.order.findFirst({
                    where: {
                        userId,
                        championshipId: type === 'FEDERATION' ? null : championshipId,
                        type,
                        paymentStatus: { in: ['PENDING', 'FAILED'] }
                    }
                });
                if (order) {
                    // Atualiza o valor e status caso tenham mudado ou estivessem em FAILED
                    order = yield prisma_1.prisma.order.update({
                        where: { id: order.id },
                        data: { amount, paymentStatus, includesFederation }
                    });
                }
                else {
                    order = yield prisma_1.prisma.order.create({
                        data: {
                            userId,
                            championshipId: type === 'FEDERATION' ? null : championshipId,
                            type,
                            amount,
                            paymentStatus,
                            includesFederation
                        }
                    });
                }
                // Se for ingresso gratuito (paymentStatus aprovado direto) e NÃO FOR ORDEM APENAS DE FEDERAÇÃO, gera o ticket. 
                // Pagamentos do MP (PENDING) devem ser tratados no Webhook ou no callback sucessfull do frontend
                let ticket = null;
                if (paymentStatus === 'APPROVED' && amountVal === 0 && type !== 'FEDERATION') {
                    // Previne duplicação de tickets gratuitos também
                    ticket = yield prisma_1.prisma.ticket.findUnique({ where: { orderId: order.id } });
                    if (!ticket) {
                        ticket = yield prisma_1.prisma.ticket.create({
                            data: {
                                orderId: order.id
                            }
                        });
                        ticket_service_1.TicketService.generateAndSendTicket(ticket.id);
                    }
                }
                res.json({ order, ticket, gatewayResponse });
            }
            catch (e) {
                console.error(e);
                res.status(500).json({ error: 'Erro ao criar pedido e processar pagamento' });
            }
        });
    }
    static listMine(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
                if (!userId)
                    return res.status(401).json({ error: 'Não autorizado' });
                const orders = yield prisma_1.prisma.order.findMany({
                    where: { userId },
                    include: { championship: true, ticket: true },
                    orderBy: { createdAt: 'desc' }
                });
                res.json(orders);
            }
            catch (e) {
                res.status(500).json({ error: 'Erro ao buscar pedidos' });
            }
        });
    }
    static getStatus(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
                const { id } = req.params;
                if (!userId)
                    return res.status(401).json({ error: 'Não autorizado' });
                const order = yield prisma_1.prisma.order.findUnique({
                    where: { id: id, userId: userId }
                });
                if (!order) {
                    return res.status(404).json({ error: 'Pedido não encontrado' });
                }
                res.json({ paymentStatus: order.paymentStatus });
            }
            catch (e) {
                console.error(e);
                res.status(500).json({ error: 'Erro ao buscar status do pedido' });
            }
        });
    }
}
exports.OrderController = OrderController;
