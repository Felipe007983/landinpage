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
exports.AdminController = void 0;
const prisma_1 = require("../prisma");
class AdminController {
    static toggleChampionshipStatus(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = req.params.id;
                const champ = yield prisma_1.prisma.championship.findUnique({ where: { id } });
                if (!champ)
                    return res.status(404).json({ error: 'Campeonato não encontrado' });
                const newStatus = champ.status === 'OPEN' ? 'CLOSED' : 'OPEN';
                const updated = yield prisma_1.prisma.championship.update({
                    where: { id },
                    data: { status: newStatus }
                });
                res.json(updated);
            }
            catch (e) {
                res.status(500).json({ error: 'Erro ao atualizar status' });
            }
        });
    }
    static listAllOrders(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const orders = yield prisma_1.prisma.order.findMany({
                    include: { user: true, championship: true },
                    orderBy: { createdAt: 'desc' }
                });
                res.json(orders);
            }
            catch (e) {
                res.status(500).json({ error: 'Erro ao listar transações' });
            }
        });
    }
    static updateChampionship(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = req.params.id;
                const data = Object.assign({}, req.body);
                // Se o admin mandou as chaves em branco, presumimos que ele não quer alterá-las, preservando as originais
                if (!data.mpAccessToken)
                    delete data.mpAccessToken;
                if (!data.mpPublicKey)
                    delete data.mpPublicKey;
                if (!data.mpWebhookSecret)
                    delete data.mpWebhookSecret;
                if (!data.mpFedAccessToken)
                    delete data.mpFedAccessToken;
                if (!data.mpFedPublicKey)
                    delete data.mpFedPublicKey;
                if (!data.mpFedWebhookSecret)
                    delete data.mpFedWebhookSecret;
                const champ = yield prisma_1.prisma.championship.update({
                    where: { id },
                    data
                });
                res.json(champ);
            }
            catch (e) {
                res.status(500).json({ error: 'Erro ao atualizar campeonato' });
            }
        });
    }
    static deleteChampionship(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = req.params.id;
                // Check if there are orders related to this championship
                const orders = yield prisma_1.prisma.order.findFirst({ where: { championshipId: id } });
                if (orders) {
                    return res.status(400).json({ error: 'Não é possível excluir um campeonato que já possui vendas registradas.' });
                }
                yield prisma_1.prisma.championship.delete({
                    where: { id }
                });
                res.json({ message: 'Campeonato excluído com sucesso' });
            }
            catch (e) {
                res.status(500).json({ error: 'Erro ao excluir campeonato' });
            }
        });
    }
    static listUsers(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const users = yield prisma_1.prisma.user.findMany({
                    where: {
                        role: 'USER',
                        orders: {
                            some: {
                                paymentStatus: 'APPROVED',
                                OR: [
                                    { type: 'FEDERATION' },
                                    { includesFederation: true }
                                ]
                            }
                        }
                    },
                    orderBy: { createdAt: 'desc' }
                });
                res.json(users);
            }
            catch (e) {
                res.status(500).json({ error: 'Erro ao listar usuários federados' });
            }
        });
    }
}
exports.AdminController = AdminController;
