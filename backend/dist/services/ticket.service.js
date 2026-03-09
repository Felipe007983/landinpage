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
Object.defineProperty(exports, "__esModule", { value: true });
exports.TicketService = void 0;
const prisma_1 = require("../prisma");
const pdf_service_1 = require("./pdf.service");
const email_service_1 = require("./email.service");
class TicketService {
    static generateAndSendTicket(ticketId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const ticket = yield prisma_1.prisma.ticket.findUnique({
                    where: { id: ticketId },
                    include: {
                        order: {
                            include: {
                                user: true,
                                championship: true
                            }
                        }
                    }
                });
                if (!ticket) {
                    console.error(`[TicketService] Ticket ${ticketId} not found.`);
                    return;
                }
                const { order } = ticket;
                const { user, championship } = order;
                if (!championship) {
                    console.error(`[TicketService] Attempted to generate ticket for order ${order.id} without championship.`);
                    return;
                }
                const ticketData = {
                    championshipName: championship.name,
                    ticketType: order.type === 'COMPETITOR' ? 'Competidor' : 'Espectador',
                    eventDate: championship.date,
                    eventLocation: championship.location,
                    userName: user.name,
                    purchaseDate: ticket.createdAt,
                    uuid: ticket.uuid
                };
                const pdfBuffer = yield pdf_service_1.PdfService.generateTicketPdf(ticketData);
                yield email_service_1.EmailService.sendTicketEmail(user.email, user.name, championship.name, pdfBuffer, order.wonTshirt);
                console.log(`[TicketService] PDF generated and email sent for ticket ${ticketId}.`);
                return pdfBuffer;
            }
            catch (error) {
                console.error(`[TicketService] Error generating/sending ticket ${ticketId}:`, error);
            }
        });
    }
}
exports.TicketService = TicketService;
