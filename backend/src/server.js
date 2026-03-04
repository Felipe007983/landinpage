"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const championships_routes_1 = __importDefault(require("./routes/championships.routes"));
const orders_routes_1 = __importDefault(require("./routes/orders.routes"));
const tickets_routes_1 = __importDefault(require("./routes/tickets.routes"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use('/api/auth', auth_routes_1.default);
app.use('/api/championships', championships_routes_1.default);
app.use('/api/orders', orders_routes_1.default);
app.use('/api/tickets', tickets_routes_1.default);
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server API is running on http://localhost:${PORT}`);
});
//# sourceMappingURL=server.js.map