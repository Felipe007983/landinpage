"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const payment_controller_1 = require("../controllers/payment.controller");
const router = (0, express_1.Router)();
router.post('/process', payment_controller_1.processPayment);
router.post('/webhook/:champId', payment_controller_1.handleWebhook);
exports.default = router;
