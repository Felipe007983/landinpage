import nodemailer from 'nodemailer';

export class EmailService {
    private static transporter = nodemailer.createTransport({
        service: 'gmail', // You can change this to your email provider
        auth: {
            user: process.env.EMAIL_USER || 'seuemail@gmail.com', // To be configured in .env
            pass: process.env.EMAIL_PASS || 'suasenha'            // To be configured in .env
        }
    });

    static async sendTicketEmail(to: string, userName: string, championshipName: string, pdfBuffer: Buffer) {
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
            const info = await this.transporter.sendMail(mailOptions);
            console.log('Ticket email sent: %s', info.messageId);
            return true;
        } catch (error) {
            console.error('Error sending ticket email:', error);
            return false;
        }
    }
}
