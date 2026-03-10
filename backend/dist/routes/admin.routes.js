"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const admin_middleware_1 = require("../middleware/admin.middleware");
const auth_1 = require("../middleware/auth");
const AdminController_1 = require("../controllers/AdminController");
const ChampionshipController_1 = require("../controllers/ChampionshipController");
const role_middleware_1 = require("../middleware/role.middleware");
const router = (0, express_1.Router)();
router.use(auth_1.authMiddleware);
router.use(admin_middleware_1.adminMiddleware);
// Campeonatos (ADMIN e SUPPORT podem criar/editar/excluir, mas tickets podem ser validados por TICKETER via outras rotas)
router.patch('/championships/:id/status', (0, role_middleware_1.requireRoles)(['ADMIN', 'SUPPORT']), AdminController_1.AdminController.toggleChampionshipStatus);
router.put('/championships/:id', (0, role_middleware_1.requireRoles)(['ADMIN', 'SUPPORT']), AdminController_1.AdminController.updateChampionship);
router.delete('/championships/:id', (0, role_middleware_1.requireRoles)(['ADMIN', 'SUPPORT']), AdminController_1.AdminController.deleteChampionship);
router.post('/championships', (0, role_middleware_1.requireRoles)(['ADMIN', 'SUPPORT']), ChampionshipController_1.ChampionshipController.create);
// Financeiro / Pedidos (Apenas ADMIN ou SUPPORT para visualizar pedidos gerais, mas dashboard principal é só ADMIN via front)
router.get('/orders', (0, role_middleware_1.requireRoles)(['ADMIN', 'SUPPORT']), AdminController_1.AdminController.listAllOrders);
// Usuários
router.get('/users', (0, role_middleware_1.requireRoles)(['ADMIN', 'SUPPORT']), AdminController_1.AdminController.listUsers);
router.post('/users', (0, role_middleware_1.requireRoles)(['ADMIN']), AdminController_1.AdminController.createUser);
router.patch('/users/:id/role', (0, role_middleware_1.requireRoles)(['ADMIN']), AdminController_1.AdminController.changeUserRole);
exports.default = router;
