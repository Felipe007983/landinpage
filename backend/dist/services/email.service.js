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
exports.EmailService = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
class EmailService {
    static sendTicketEmail(to, userName, championshipName, pdfBuffer) {
        return __awaiter(this, void 0, void 0, function* () {
            const mailOptions = {
                from: `"Zeus Evolution" <${process.env.EMAIL_USER || 'no-reply@zeusevolution.com.br'}>`,
                to,
                subject: `Seu Ingresso para ${championshipName} - Zeus Evolution`,
                text: `Olá ${userName},\n\nSeu ingresso para o evento ${championshipName} foi gerado com sucesso!\n\nPor favor, encontre-o em anexo. Apresente o QRCode na entrada do evento.\n\nAtenciosamente,\nEquipe Zeus Evolution`,
                html: `
                <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
                    <h2 style="color: #D4AF37; text-align: center;">Zeus Evolution</h2>
                    <p>Olá <strong>${userName}</strong>,</p>
                    <p>Seu ingresso para o evento <strong>${championshipName}</strong> foi gerado com sucesso!</p>
                    <p>Encontre-o no arquivo PDF em anexo. Você pode baixar, imprimir, ou simplesmente apresentar o QRCode na tela do seu celular na portaria do evento.</p>
                    <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
                    <p style="font-size: 12px; color: #777; text-align: center;">Atenciosamente,<br>Equipe Zeus Evolution</p>
                </div>
            `,
                attachments: [
                    {
                        filename: `ingresso-${championshipName.replace(/\s+/g, '-').toLowerCase()}.pdf`,
                        content: pdfBuffer,
                        contentType: 'application/pdf'
                    }
                ]
            };
            try {
                const info = yield this.transporter.sendMail(mailOptions);
                console.log('Ticket email sent: %s', info.messageId);
                return true;
            }
            catch (error) {
                console.error('Error sending ticket email:', error);
                return false;
            }
        });
    }
}
exports.EmailService = EmailService;
EmailService.transporter = nodemailer_1.default.createTransport({
    service: 'gmail', // You can change this to your email provider
    auth: {
        user: process.env.EMAIL_USER || 'zapliderdigital@gmail.com', // To be configured in .env
        pass: process.env.EMAIL_PASS || 'mjgb gitw myhl lrtx' // To be configured in .env
    }
});
