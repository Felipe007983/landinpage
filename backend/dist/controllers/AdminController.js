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
}
exports.AdminController = AdminController;
