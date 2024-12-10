import Mail from "nodemailer/lib/mailer/index.js";
import { transporter } from "./mailer.js";
import dotenv from 'dotenv';

dotenv.config();

export class MailService {
    static sendMail = async (to: string[], subject: string, text: string, html: string) => {
        try {
            const info = await transporter.sendMail({
                from: '"Alquilcar Reservas" <' + process.env.EMAIL_USER + '>', // sender address
                to: to, 
                subject: subject,
                text: text, 
                html: html, 
              });
            console.log("Message sent: %s", info.messageId);
        } catch (error: any) {
            console.error(error.message);
        }
    }
}
