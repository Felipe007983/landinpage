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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChampionshipController = void 0;
const prisma_1 = require("../prisma");
class ChampionshipController {
    static list(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const champs = yield prisma_1.prisma.championship.findMany({
                    orderBy: { date: 'asc' }
                });
                const safeChamps = champs.map(c => {
                    const { mpAccessToken, mpWebhookSecret } = c, safeData = __rest(c, ["mpAccessToken", "mpWebhookSecret"]);
                    return safeData;
                });
                res.json(safeChamps);
            }
            catch (e) {
                res.status(500).json({ error: 'Erro ao listar campeonatos' });
            }
        });
    }
    static getById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const champ = yield prisma_1.prisma.championship.findUnique({
                    where: { id: req.params.id }
                });
                if (!champ)
                    return res.status(404).json({ error: 'Campeonato não encontrado' });
                const { mpAccessToken, mpWebhookSecret } = champ, safeData = __rest(champ, ["mpAccessToken", "mpWebhookSecret"]);
                res.json(safeData);
            }
            catch (e) {
                res.status(500).json({ error: 'Erro ao buscar campeonato' });
            }
        });
    }
    static create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const champ = yield prisma_1.prisma.championship.create({ data: req.body });
                const { mpAccessToken, mpWebhookSecret } = champ, safeData = __rest(champ, ["mpAccessToken", "mpWebhookSecret"]);
                res.json(safeData);
            }
            catch (e) {
                res.status(500).json({ error: 'Erro ao criar campeonato' });
            }
        });
    }
}
exports.ChampionshipController = ChampionshipController;
