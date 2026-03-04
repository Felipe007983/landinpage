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
exports.CreditCardController = void 0;
const prisma_1 = require("../prisma");
class CreditCardController {
    static list(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
                if (!userId)
                    return res.status(401).json({ error: 'Não autorizado' });
                const cards = yield prisma_1.prisma.creditCard.findMany({
                    where: { userId }
                });
                res.json(cards);
            }
            catch (e) {
                res.status(500).json({ error: 'Erro ao listar cartões' });
            }
        });
    }
    static create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
                const { cardNumber, expiry, isDefault } = req.body;
                if (!userId)
                    return res.status(401).json({ error: 'Não autorizado' });
                // Mock saving the credit card
                const maskedNumber = '****.****.****.' + cardNumber.slice(-4);
                const token = 'tok_mock_' + Math.random().toString(36).substring(7);
                // If this is set as default, remove default from others
                if (isDefault) {
                    yield prisma_1.prisma.creditCard.updateMany({
                        where: { userId },
                        data: { isDefault: false }
                    });
                }
                const card = yield prisma_1.prisma.creditCard.create({
                    data: {
                        userId,
                        maskedNumber,
                        expiry,
                        token,
                        isDefault: isDefault || false
                    }
                });
                res.json(card);
            }
            catch (e) {
                console.error(e);
                res.status(500).json({ error: 'Erro ao salvar cartão' });
            }
        });
    }
    static delete(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
                const cardId = req.params.id;
                if (!userId)
                    return res.status(401).json({ error: 'Não autorizado' });
                yield prisma_1.prisma.creditCard.delete({
                    where: { id: cardId }
                });
                res.status(204).send();
            }
            catch (e) {
                res.status(500).json({ error: 'Erro ao deletar cartão' });
            }
        });
    }
}
exports.CreditCardController = CreditCardController;
