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
exports.handleWebhook = exports.createPreference = void 0;
const mercadopago_1 = require("mercadopago");
const crypto_1 = __importDefault(require("crypto"));
const prisma_1 = require("../prisma");
const createPreference = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { items, orderId } = req.body;
        // Você pode pegar o access token do .env
        const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN;
        if (!accessToken) {
            return res.status(500).json({ error: 'MERCADOPAGO_ACCESS_TOKEN não configurado no servidor (.env).' });
        }
        const client = new mercadopago_1.MercadoPagoConfig({ accessToken });
        const preference = new mercadopago_1.Preference(client);
        // URL base do frontend (pode vir do body ou variável de ambiente)
        const baseUrl = req.body.returnUrl || 'http://localhost:5173';
        // Limpando baseUrl para evitar barras extras no final
        let cleanBaseUrl = baseUrl;
        if (cleanBaseUrl.endsWith('/')) {
            cleanBaseUrl = cleanBaseUrl.slice(0, -1);
        }
        // Se o frontend não enviar ou enviar string vazia, defina um fallback local estrito
        if (!cleanBaseUrl || cleanBaseUrl === 'null' || cleanBaseUrl === 'undefined') {
            cleanBaseUrl = 'http://localhost:5173';
        }
        const response = yield preference.create({
            body: {
                // Adicionando external_reference para o Webhook achar esse pedido
                external_reference: orderId ? orderId.toString() : undefined,
                items: items || [
                    {
                        title: 'Meu produto',
                        quantity: 1,
                        unit_price: 2000
                    }
                ],
                back_urls: {
                    success: `${cleanBaseUrl}/minha-conta`,
                    failure: `${cleanBaseUrl}/minha-conta`
                },
                auto_return: 'approved'
            }
        });
        // Se recebemos um orderId, salvamos o ID da preferência gerada nele para referência cruzada inicial (opcional)
        if (orderId) {
            yield prisma_1.prisma.order.update({
                where: { id: orderId },
                data: { gatewayOrderId: response.id }
            });
        }
        res.status(200).json({ id: response.id });
    }
    catch (error) {
        console.error('Error creating preference:', error);
        res.status(500).json({ error: 'Erro ao criar preferência de pagamento' });
    }
});
exports.createPreference = createPreference;
const handleWebhook = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const xSignature = req.headers['x-signature'];
        const xRequestId = req.headers['x-request-id'];
        const dataId = req.query['data.id'];
        const type = req.query.type;
        if (!xSignature || !xRequestId || !dataId) {
            // Requisição inválida, ignorando sem alertar erro grave
            return res.status(400).send('Missing webhook signature params');
        }
        // 1. Extraindo chave secreta do MP
        const webhookSecret = process.env.MERCADOPAGO_WEBHOOK_SECRET;
        // Extraindo partes (v1=chave, ts=timestamp)
        const parts = xSignature.split(',');
        let ts = '';
        let hashOriginal = '';
        parts.forEach(part => {
            const [key, value] = part.split('=').map(p => p.trim());
            if (key === 'ts')
                ts = value;
            if (key === 'v1')
                hashOriginal = value;
        });
        if (!ts || !hashOriginal || !webhookSecret) {
            console.warn('Incompletos headers ou secret não configurado. Se estiver testando localmente pularemos a validação real.');
        }
        else {
            // 2. Validação HMAC Hexadecimal SHA256
            const manifest = `id:${dataId};request-id:${xRequestId};ts:${ts};`;
            const hmac = crypto_1.default.createHmac('sha256', webhookSecret).update(manifest).digest('hex');
            if (hmac !== hashOriginal) {
                console.error('Webhook - HMAC verification failed');
                return res.status(403).send('Forbidden: HMAC signature mismatch');
            }
        }
        // Retornar 200 OK imediatamente para liberar a fila do webhook Mercado Pago
        res.status(200).send('OK');
        // ==== Processando Notificação ====
        if (type === 'payment') {
            const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN || '';
            const client = new mercadopago_1.MercadoPagoConfig({ accessToken });
            const paymentClient = new mercadopago_1.Payment(client);
            // Busca o estado real do pagamento
            const paymentInfo = yield paymentClient.get({ id: dataId });
            console.log(`[Webhook] Pagamento recebido: ID ${paymentInfo.id} | Status: ${paymentInfo.status}`);
            // Atualiza banco com Prisma
            if (paymentInfo.status === 'approved' && ((_a = paymentInfo.order) === null || _a === void 0 ? void 0 : _a.id)) {
                // Como não podemos confiar 100% que orderId venha da Preference ID inicial, 
                // A melhor prática na integração Preference + Checkout Pro é enviar o orderId local no campo `external_reference`
                // Assumindo que setamos external_reference na Preference = local order.id:
                const localOrderId = paymentInfo.external_reference;
                if (localOrderId) {
                    const orderToUpdate = yield prisma_1.prisma.order.findUnique({ where: { id: localOrderId } });
                    if (orderToUpdate && orderToUpdate.paymentStatus !== 'APPROVED') {
                        yield prisma_1.prisma.order.update({
                            where: { id: localOrderId },
                            data: {
                                paymentStatus: 'APPROVED',
                                gatewayOrderId: paymentInfo.id.toString()
                            }
                        });
                        // Geraremos aqui o ticket se o pedido foi aprovado pela 1a vez
                        yield prisma_1.prisma.ticket.create({
                            data: {
                                orderId: localOrderId
                            }
                        });
                        console.log(`[Webhook] Ticket gerado com sucesso para a Order ID ${localOrderId}`);
                    }
                }
            }
        }
    }
    catch (error) {
        console.error('Error handling webhook:', error);
        // Não devemos retornar 500 caso o erro seja na consulta ao DB para não travar o MP
    }
});
exports.handleWebhook = handleWebhook;
