"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireRoles = void 0;
const requireRoles = (allowedRoles) => {
    return (req, res, next) => {
        const userRole = req.userRole;
        if (!userRole || !allowedRoles.includes(userRole)) {
            return res.status(403).json({ error: 'Acesso negado: Seu perfil não tem permissão para esta ação.' });
        }
        next();
    };
};
exports.requireRoles = requireRoles;
