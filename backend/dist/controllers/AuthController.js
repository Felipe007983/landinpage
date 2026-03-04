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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prisma_1 = require("../prisma");
class AuthController {
    static register(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { name, cpf, email, phone, password, address } = req.body;
                const exists = yield prisma_1.prisma.user.findFirst({ where: { OR: [{ email }, { cpf }] } });
                if (exists)
                    return res.status(400).json({ error: 'E-mail ou CPF já cadastrados' });
                const password_hash = yield bcrypt_1.default.hash(password, 10);
                const user = yield prisma_1.prisma.user.create({
                    data: { name, cpf, email, phone, password_hash, address }
                });
                const token = jsonwebtoken_1.default.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET || 'secret', { expiresIn: '1d' });
                res.json({ user: { id: user.id, name: user.name, email: user.email }, token });
            }
            catch (e) {
                res.status(500).json({ error: 'Erro ao registrar usuário' });
            }
        });
    }
    static login(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, password } = req.body;
                const user = yield prisma_1.prisma.user.findUnique({ where: { email } });
                if (!user)
                    return res.status(404).json({ error: 'Usuário não encontrado' });
                const matches = yield bcrypt_1.default.compare(password, user.password_hash);
                if (!matches)
                    return res.status(401).json({ error: 'Senha incorreta' });
                const token = jsonwebtoken_1.default.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET || 'secret', { expiresIn: '1d' });
                res.json({ user: { id: user.id, name: user.name, email: user.email }, token });
            }
            catch (e) {
                res.status(500).json({ error: 'Erro no login' });
            }
        });
    }
    static me(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const id = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
            if (!id)
                return res.status(401).json({ error: 'Unauthorized' });
            const user = yield prisma_1.prisma.user.findUnique({ where: { id }, select: { id: true, name: true, email: true, cpf: true, phone: true } });
            res.json(user);
        });
    }
}
exports.AuthController = AuthController;
