"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const payment_controller_1 = require("../controllers/payment.controller");
const router = (0, express_1.Router)();
router.post('/create_preference', payment_controller_1.createPreference);
router.post('/webhook', payment_controller_1.handleWebhook);
exports.default = router;
