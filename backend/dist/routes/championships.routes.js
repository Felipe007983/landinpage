"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const ChampionshipController_1 = require("../controllers/ChampionshipController");
const router = (0, express_1.Router)();
router.get('/', ChampionshipController_1.ChampionshipController.list);
router.get('/:id', ChampionshipController_1.ChampionshipController.getById);
router.post('/', ChampionshipController_1.ChampionshipController.create); // Simples para seeding
exports.default = router;
