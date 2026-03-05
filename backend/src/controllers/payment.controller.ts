import { Request, Response } from 'express';
import { MercadoPagoConfig, Preference, Payment } from 'mercadopago';
import crypto from 'crypto';
import { prisma } from '../prisma';

export const createPreference = async (req: Request, res: Response) => {
    try {
        const { items, orderId } = req.body;

        // Você pode pegar o access token do .env
        const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN;

        if (!accessToken) {
            return res.status(500).json({ error: 'MERCADOPAGO_ACCESS_TOKEN não configurado no servidor (.env).' });
        }

        const client = new MercadoPagoConfig({ accessToken });
        const preference = new Preference(client);

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

        const response = await preference.create({
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
            await prisma.order.update({
                where: { id: orderId },
                data: { gatewayOrderId: response.id }
            });
        }

        res.status(200).json({ id: response.id });
    } catch (error) {
        console.error('Error creating preference:', error);
        res.status(500).json({ error: 'Erro ao criar preferência de pagamento' });
    }
};

export const handleWebhook = async (req: Request, res: Response) => {
    try {
        const xSignature = req.headers['x-signature'] as string;
        const xRequestId = req.headers['x-request-id'] as string;
        const dataId = req.query['data.id'] as string;
        const type = req.query.type as string;

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
            if (key === 'ts') ts = value;
            if (key === 'v1') hashOriginal = value;
        });

        if (!ts || !hashOriginal || !webhookSecret) {
            console.warn('Incompletos headers ou secret não configurado. Se estiver testando localmente pularemos a validação real.');
        } else {
            // 2. Validação HMAC Hexadecimal SHA256
            const manifest = `id:${dataId};request-id:${xRequestId};ts:${ts};`;
            const hmac = crypto.createHmac('sha256', webhookSecret).update(manifest).digest('hex');

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
            const client = new MercadoPagoConfig({ accessToken });
            const paymentClient = new Payment(client);

            // Busca o estado real do pagamento
            const paymentInfo = await paymentClient.get({ id: dataId });
            console.log(`[Webhook] Pagamento recebido: ID ${paymentInfo.id} | Status: ${paymentInfo.status}`);

            // Atualiza banco com Prisma
            if (paymentInfo.status === 'approved' && paymentInfo.order?.id) {
                // Como não podemos confiar 100% que orderId venha da Preference ID inicial, 
                // A melhor prática na integração Preference + Checkout Pro é enviar o orderId local no campo `external_reference`
                // Assumindo que setamos external_reference na Preference = local order.id:

                const localOrderId = paymentInfo.external_reference;

                if (localOrderId) {
                    const orderToUpdate = await prisma.order.findUnique({ where: { id: localOrderId } });

                    if (orderToUpdate && orderToUpdate.paymentStatus !== 'APPROVED') {
                        await prisma.order.update({
                            where: { id: localOrderId },
                            data: {
                                paymentStatus: 'APPROVED',
                                gatewayOrderId: paymentInfo.id!.toString()
                            }
                        });

                        // Geraremos aqui o ticket se o pedido foi aprovado pela 1a vez
                        await prisma.ticket.create({
                            data: {
                                orderId: localOrderId
                            }
                        });
                        console.log(`[Webhook] Ticket gerado com sucesso para a Order ID ${localOrderId}`);
                    }
                }
            }
        }

    } catch (error) {
        console.error('Error handling webhook:', error);
        // Não devemos retornar 500 caso o erro seja na consulta ao DB para não travar o MP
    }
};
