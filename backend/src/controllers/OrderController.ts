import { Request, Response } from 'express';
import { prisma } from '../prisma';
import { TicketService } from '../services/ticket.service';

export class OrderController {
    static async create(req: Request, res: Response) {
        try {
            const userId = (req as any).user?.id;
            const { championshipId, type, paymentMethod, creditCardId } = req.body;

            if (!userId) {
                return res.status(401).json({ error: 'Não autorizado' });
            }

            const champ = await prisma.championship.findUnique({ where: { id: championshipId } });
            if (!champ) return res.status(404).json({ error: 'Campeonato não encontrado' });

            const amount = type === 'COMPETITOR' ? champ.priceComp : champ.priceVis;

            // Gateway Mock Processing
            let paymentStatus = 'PENDING';
            let gatewayResponse: any = {};

            // Se o valor for 0, aprova direto (gratuito / teste)
            const amountVal = parseFloat(amount?.toString() || '0');
            if (amountVal === 0) {
                paymentStatus = 'APPROVED';
                gatewayResponse = {
                    message: 'Ingresso gratuito emitido com sucesso.',
                    isFree: true
                };
            } else if (paymentMethod === 'PIX') {
                // Simula a geração de um QRCode PIX
                // Em um cenário real, `paymentStatus` começa PENDING e um Webhook atualiza para APPROVED.
                // Mas para o Mock interativo do frontend, vamos aprovar caso o cliente "confirme", ou aprovar direto para acelerar o teste:
                paymentStatus = 'APPROVED';
                gatewayResponse = {
                    qrCodeData: '00020101021126580014br.gov.bcb.pix0136123e4567-e89b-12d3-a456-426655440000520400005303986540510.005802BR5913ZEUS EVOLUTION6008BRASILIA62070503***6304A1B2',
                    qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=mockpix'
                };
            } else if (paymentMethod === 'CREDIT_CARD' || paymentMethod === 'DEBIT_CARD') {
                // Simula processamento de cartão instantâneo
                // Idealmente validaríamos o creditCardId aqui.
                paymentStatus = 'APPROVED';
                gatewayResponse = {
                    transactionId: 'txn_mock_' + Math.random().toString(36).substring(7),
                    message: 'Pagamento aprovado com sucesso'
                };
            }

            const order = await prisma.order.create({
                data: {
                    userId,
                    championshipId,
                    type,
                    amount,
                    paymentStatus
                }
            });

            // Se aprovado na hora, gera o ticket
            let ticket = null;
            if (paymentStatus === 'APPROVED') {
                ticket = await prisma.ticket.create({
                    data: {
                        orderId: order.id
                    }
                });
                // Send email synchronously or asynchronously
                TicketService.generateAndSendTicket(ticket.id);
            }

            res.json({ order, ticket, gatewayResponse });
        } catch (e) {
            console.error(e);
            res.status(500).json({ error: 'Erro ao criar pedido e processar pagamento' });
        }
    }

    static async listMine(req: Request, res: Response) {
        try {
            const userId = (req as any).user?.id;
            if (!userId) return res.status(401).json({ error: 'Não autorizado' });

            const orders = await prisma.order.findMany({
                where: { userId },
                include: { championship: true, ticket: true },
                orderBy: { createdAt: 'desc' }
            });

            res.json(orders);
        } catch (e) {
            res.status(500).json({ error: 'Erro ao buscar pedidos' });
        }
    }
}
