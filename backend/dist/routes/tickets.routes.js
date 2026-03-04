"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const TicketController_1 = require("../controllers/TicketController");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
router.get('/my-tickets', auth_1.authMiddleware, TicketController_1.TicketController.listByUser);
router.post('/validate', auth_1.authMiddleware, TicketController_1.TicketController.validate); // Requer admin numa app real
exports.default = router;
