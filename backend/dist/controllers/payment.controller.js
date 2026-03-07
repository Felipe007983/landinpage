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
exports.handleWebhook = exports.processPayment = void 0;
const mercadopago_1 = require("mercadopago");
const crypto_1 = __importDefault(require("crypto"));
const prisma_1 = require("../prisma");
const ticket_service_1 = require("../services/ticket.service");
const processPayment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p;
    try {
        const { paymentData, orderId } = req.body;
        const order = yield prisma_1.prisma.order.findUnique({ where: { id: orderId }, include: { championship: true } });
        if (!order)
            return res.status(404).json({ error: 'Pedido não encontrado no ato do pagamento.' });
        const accessToken = ((_a = order.championship) === null || _a === void 0 ? void 0 : _a.mpAccessToken) || process.env.MERCADOPAGO_ACCESS_TOKEN;
        if (!accessToken) {
            return res.status(500).json({ error: 'MERCADOPAGO_ACCESS_TOKEN não configurado no servidor (.env) e nem no Campeonato alvo.' });
        }
        const client = new mercadopago_1.MercadoPagoConfig({ accessToken });
        const paymentClient = new mercadopago_1.Payment(client);
        // Splitting name to avoid high risk rejections
        const fullName = ((_b = paymentData.payer) === null || _b === void 0 ? void 0 : _b.name) || req.body.cardholderName || paymentData.cardholderName || '';
        const nameParts = fullName.split(' ');
        const firstName = nameParts[0] || 'Cliente';
        const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : 'Evolução';
        // Construção robusta do body baseada no exemplo da documentação e no snippet do frontend
        const body = {
            transaction_amount: Number(paymentData.transaction_amount),
            token: paymentData.token,
            description: paymentData.description || `Pagamento Pedido ${orderId}`,
            installments: Number(paymentData.installments),
            payment_method_id: paymentData.payment_method_id || paymentData.paymentMethodId,
            payer: {
                email: ((_c = paymentData.payer) === null || _c === void 0 ? void 0 : _c.email) || paymentData.email,
                first_name: firstName,
                last_name: lastName,
                identification: {
                    type: ((_e = (_d = paymentData.payer) === null || _d === void 0 ? void 0 : _d.identification) === null || _e === void 0 ? void 0 : _e.type) || paymentData.identificationType,
                    number: ((_g = (_f = paymentData.payer) === null || _f === void 0 ? void 0 : _f.identification) === null || _g === void 0 ? void 0 : _g.number) || paymentData.identificationNumber || paymentData.number
                }
            },
            external_reference: orderId ? orderId.toString() : undefined,
            notification_url: `https://unretained-cammy-nonsynoptical.ngrok-free.dev/api/payment/webhook/${((_h = order.championship) === null || _h === void 0 ? void 0 : _h.id) || 'global'}`,
            binary_mode: true,
        };
        const issuerIdRaw = paymentData.issuer_id || paymentData.issuerId || paymentData.issuer;
        if (issuerIdRaw && issuerIdRaw.toString().trim() !== '') {
            body.issuer_id = issuerIdRaw;
        }
        console.log(`[Payment] Processando Pagamento Transparente para Order ID: ${orderId}`);
        console.log(`[Payment] Body final enviado ao MP: ${JSON.stringify(body, null, 2)}`);
        // console.log(`[Payment] paymentData do Frontend: ${JSON.stringify(paymentData, null, 2)}`);
        const response = yield paymentClient.create({
            body,
            requestOptions: { idempotencyKey: orderId }
        });
        console.log(`[Payment] Resposta: Status ${response.status}, ID ${response.id}`);
        if (response.status === 'rejected') {
            yield prisma_1.prisma.order.delete({ where: { id: orderId } });
            console.log(`[Payment] Pedido ${orderId} deletado da base de dados pois o cartão foi recursado imediatamente.`);
        }
        // O Mercado Pago pode retornar status imediatamente approved, rejected, in_process
        res.status(200).json({
            id: response.id,
            status: response.status,
            status_detail: response.status_detail,
            transaction_amount: response.transaction_amount,
            qr_code: (_k = (_j = response.point_of_interaction) === null || _j === void 0 ? void 0 : _j.transaction_data) === null || _k === void 0 ? void 0 : _k.qr_code,
            qr_code_base64: (_m = (_l = response.point_of_interaction) === null || _l === void 0 ? void 0 : _l.transaction_data) === null || _m === void 0 ? void 0 : _m.qr_code_base64,
            ticket_url: (_p = (_o = response.point_of_interaction) === null || _o === void 0 ? void 0 : _o.transaction_data) === null || _p === void 0 ? void 0 : _p.ticket_url
        });
    }
    catch (error) {
        console.error('Error processing payment:', error.message || error);
        if (error.cause) {
            console.error('Cause detail:', JSON.stringify(error.cause, null, 2));
        }
        res.status(500).json({
            error: 'Erro ao processar pagamento transparente',
            details: error.message,
            mp_error: error.cause
        });
    }
});
exports.processPayment = processPayment;
const handleWebhook = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e;
    try {
        const xSignature = req.headers['x-signature'];
        const xRequestId = req.headers['x-request-id'];
        let dataId;
        if ((_a = req.query) === null || _a === void 0 ? void 0 : _a['data.id']) {
            dataId = req.query['data.id'];
        }
        else if ((_c = (_b = req.body) === null || _b === void 0 ? void 0 : _b.data) === null || _c === void 0 ? void 0 : _c.id) {
            dataId = req.body.data.id;
        }
        const type = req.query.type || ((_d = req.body) === null || _d === void 0 ? void 0 : _d.type) || ((_e = req.body) === null || _e === void 0 ? void 0 : _e.action);
        const champId = req.params.champId;
        if (!dataId || !champId) {
            console.warn('Missing webhook dataId or champId param, returning 200 to acknowledge MP ping', req.body);
            return res.status(200).send('Ignored');
        }
        let webhookSecret;
        let championship = null;
        if (champId === 'global') {
            webhookSecret = process.env.MERCADOPAGO_WEBHOOK_SECRET;
            console.log(`[Webhook] Processando notificação GLOBAL (Federação).`);
        }
        else {
            championship = yield prisma_1.prisma.championship.findUnique({ where: { id: champId } });
            if (!championship) {
                console.warn(`[Webhook] Campeonato ${champId} não encontrado no banco.`);
                return res.status(404).json({ error: 'Campeonato não encontrado' });
            }
            webhookSecret = championship.mpWebhookSecret || process.env.MERCADOPAGO_WEBHOOK_SECRET;
        }
        // 1. Extraindo headers de assinatura do MP
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
                console.warn(`[Webhook] HMAC verification failed. hmac: ${hmac}, hashOriginal: ${hashOriginal}, manifest: ${manifest}. Permitindo processamento temporariamente.`);
                // Ignorando erro de HMAC estritamente para não bloquear o fluxo de IPNs de PIX
            }
            else {
                console.log('[Webhook] HMAC verified successfully!');
            }
        }
        // Retornar 200 OK imediatamente para liberar a fila do webhook Mercado Pago
        res.status(200).send('OK');
        // ==== Processando Notificação ====
        if (type === 'payment') {
            const accessToken = (championship === null || championship === void 0 ? void 0 : championship.mpAccessToken) || process.env.MERCADOPAGO_ACCESS_TOKEN || '';
            const client = new mercadopago_1.MercadoPagoConfig({ accessToken });
            const paymentClient = new mercadopago_1.Payment(client);
            // Busca o estado real do pagamento
            const paymentInfo = yield paymentClient.get({ id: dataId });
            console.log(`[Webhook] Pagamento recebido: ID ${paymentInfo.id} | Status: ${paymentInfo.status}`);
            // Atualiza banco com Prisma
            if (paymentInfo.external_reference) {
                const localOrderId = paymentInfo.external_reference;
                const orderToUpdate = yield prisma_1.prisma.order.findUnique({
                    where: { id: localOrderId },
                    include: { ticket: true }
                });
                if (orderToUpdate) {
                    if (paymentInfo.status === 'approved') {
                        if (orderToUpdate.paymentStatus !== 'APPROVED') {
                            yield prisma_1.prisma.order.update({
                                where: { id: localOrderId },
                                data: {
                                    paymentStatus: 'APPROVED',
                                    gatewayOrderId: paymentInfo.id.toString()
                                }
                            });
                        }
                        if (orderToUpdate.includesFederation || orderToUpdate.type === 'FEDERATION') {
                            const currentYear = new Date().getFullYear();
                            yield prisma_1.prisma.user.update({
                                where: { id: orderToUpdate.userId },
                                data: { federationYear: currentYear }
                            });
                            console.log(`[Webhook] Usuário ${orderToUpdate.userId} ativado na Federação para o ano ${currentYear}`);
                        }
                        // Idempotência: só gera o ticket se ele não existir e se não for uma ordem APENAS de federação
                        if (!orderToUpdate.ticket && orderToUpdate.type !== 'FEDERATION') {
                            const ticket = yield prisma_1.prisma.ticket.create({
                                data: {
                                    orderId: localOrderId
                                }
                            });
                            console.log(`[Webhook] Ticket gerado com sucesso para a Order ID ${localOrderId}`);
                            ticket_service_1.TicketService.generateAndSendTicket(ticket.id);
                        }
                        else if (orderToUpdate.type === 'FEDERATION') {
                            console.log(`[Webhook] Ordem exclusiva de Federação ${localOrderId}. Nenhum ticket físico gerado.`);
                        }
                        else {
                            console.log(`[Webhook] Ticket já existente para a Order ID ${localOrderId}, ignorando re-geração.`);
                        }
                    }
                    else if (paymentInfo.status === 'rejected' || paymentInfo.status === 'cancelled') {
                        // Ao invés de atualizar para FAILED, apaga fisicamente para limpar o banco
                        yield prisma_1.prisma.order.delete({
                            where: { id: localOrderId }
                        });
                        console.log(`[Webhook] Pedido ${localOrderId} foi DELETADO pois o pagamento foi rejeitado ou cancelado.`);
                    }
                    else if (paymentInfo.status === 'in_process') {
                        console.log(`[Webhook] Pedido ${localOrderId} ainda está em processamento.`);
                    }
                }
                else {
                    console.error(`[Webhook] Pedido local ${localOrderId} não encontrado. Talvez já tenha sido apagado.`);
                }
            }
            else {
                console.warn(`[Webhook] Pagamento sem external_reference recebido: ID ${dataId}`);
            }
        }
    }
    catch (error) {
        console.error('Error handling webhook:', error);
        // Não devemos retornar 500 caso o erro seja na consulta ao DB para não travar o MP
    }
});
exports.handleWebhook = handleWebhook;
