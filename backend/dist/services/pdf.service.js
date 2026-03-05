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
exports.PdfService = void 0;
const pdfkit_1 = __importDefault(require("pdfkit"));
const qrcode_1 = __importDefault(require("qrcode"));
const date_fns_1 = require("date-fns");
class PdfService {
    static generateTicketPdf(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                try {
                    // Generate QR Code Buffer
                    const qrCodeDataUrl = yield qrcode_1.default.toDataURL(data.uuid, { width: 150, margin: 1 });
                    const qrCodeBuffer = Buffer.from(qrCodeDataUrl.split(',')[1], 'base64');
                    // A "movie ticket" aspect ratio, e.g., 600x250
                    const Doc = pdfkit_1.default.default || pdfkit_1.default;
                    const doc = new Doc({
                        size: [600, 250],
                        margin: 0
                    });
                    const buffers = [];
                    doc.on('data', (chunk) => buffers.push(chunk));
                    doc.on('end', () => {
                        const pdfData = Buffer.concat(buffers);
                        resolve(pdfData);
                    });
                    // Background Color
                    doc.rect(0, 0, 600, 250).fill('#111111');
                    // Ticket Border/Dashend Line Separator
                    doc.moveTo(420, 20).lineTo(420, 230).dash(5, { space: 5 }).stroke('#444444');
                    doc.undash();
                    // Left Side - Event Details
                    const champName = data.championshipName || 'Evento Zeus';
                    doc.fillColor('#D4AF37') // Gold/Amber color
                        .fontSize(22)
                        .font('Helvetica-Bold')
                        .text(champName.toUpperCase(), 30, 30, { width: 380, align: 'left' });
                    const ticketType = data.ticketType || 'Visitante';
                    doc.fillColor('#FFFFFF')
                        .fontSize(12)
                        .font('Helvetica')
                        .text(`TIPO: ${ticketType.toUpperCase()}`, 30, 70);
                    const formattedEventDate = (0, date_fns_1.format)(new Date(data.eventDate), "dd/MM/yyyy 'às' HH:mm");
                    doc.fillColor('#AAAAAA')
                        .fontSize(10)
                        .text(`Data do Evento: ${formattedEventDate}`, 30, 95);
                    const eventLoc = data.eventLocation || 'Local a definir';
                    doc.text(`Local: ${eventLoc}`, 30, 115, { width: 370 });
                    // Attendee Info
                    const userName = data.userName || 'Participante';
                    doc.fillColor('#FFFFFF')
                        .fontSize(14)
                        .font('Helvetica-Bold')
                        .text(userName.toUpperCase(), 30, 160);
                    const formattedPurchaseDate = (0, date_fns_1.format)(new Date(data.purchaseDate), "dd/MM/yyyy HH:mm");
                    doc.fillColor('#666666')
                        .fontSize(9)
                        .font('Helvetica')
                        .text(`Comprado em: ${formattedPurchaseDate}`, 30, 185);
                    doc.text(`ID: ${data.uuid}`, 30, 200, { width: 370 });
                    // Right Side - QR Code
                    doc.image(qrCodeBuffer, 435, 30, { width: 130 });
                    doc.fillColor('#AAAAAA')
                        .fontSize(8)
                        .text('Apresente este código na', 435, 170, { width: 130, align: 'center' })
                        .text('portaria do evento.', 435, 185, { width: 130, align: 'center' });
                    doc.end();
                }
                catch (error) {
                    reject(error);
                }
            }));
        });
    }
}
exports.PdfService = PdfService;
