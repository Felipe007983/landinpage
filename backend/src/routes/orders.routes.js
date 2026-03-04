"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const OrderController_1 = require("../controllers/OrderController");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
router.post('/', auth_1.authMiddleware, OrderController_1.OrderController.create);
router.get('/my-orders', auth_1.authMiddleware, OrderController_1.OrderController.listByUser);
exports.default = router;
//# sourceMappingURL=orders.routes.js.map