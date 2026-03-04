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
                const champ = yield prisma_1.prisma.championship.findUnique({ where: { id: championshipId } });
                if (!champ)
                    return res.status(404).json({ error: 'Campeonato não encontrado' });
                const amount = type === 'COMPETITOR' ? champ.priceComp : champ.priceVis;
                // Gateway Mock Processing
                let paymentStatus = 'PENDING';
                let gatewayResponse = {};
                if (paymentMethod === 'PIX') {
                    // Simula a geração de um QRCode PIX
                    // Em um cenário real, `paymentStatus` começa PENDING e um Webhook atualiza para APPROVED.
                    // Mas para o Mock interativo do frontend, vamos aprovar caso o cliente "confirme", ou aprovar direto para acelerar o teste:
                    paymentStatus = 'APPROVED';
                    gatewayResponse = {
                        qrCodeData: '00020101021126580014br.gov.bcb.pix0136123e4567-e89b-12d3-a456-426655440000520400005303986540510.005802BR5913ZEUS EVOLUTION6008BRASILIA62070503***6304A1B2',
                        qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=mockpix'
                    };
                }
                else if (paymentMethod === 'CREDIT_CARD' || paymentMethod === 'DEBIT_CARD') {
                    // Simula processamento de cartão instantâneo
                    // Idealmente validaríamos o creditCardId aqui.
                    paymentStatus = 'APPROVED';
                    gatewayResponse = {
                        transactionId: 'txn_mock_' + Math.random().toString(36).substring(7),
                        message: 'Pagamento aprovado com sucesso'
                    };
                }
                const order = yield prisma_1.prisma.order.create({
                    data: {
                        userId,
                        championshipId,
                        type,
                        amount,
                        paymentStatus
                    }
                });
                // Se aprovado na hora, gera o ticket
                let ticket = null;
                if (paymentStatus === 'APPROVED') {
                    ticket = yield prisma_1.prisma.ticket.create({
                        data: {
                            orderId: order.id
                        }
                    });
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
}
exports.OrderController = OrderController;
