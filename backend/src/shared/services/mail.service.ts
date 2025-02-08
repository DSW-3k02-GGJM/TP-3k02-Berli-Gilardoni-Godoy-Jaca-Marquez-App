// Configuration
import { EMAIL_USER } from '../../config.js';

// Utility Functions
import { transporter } from '../utils/mailer.js';

export class MailService {
  static sendMail = async (
    to: string[],
    subject: string,
    text: string,
    html: string
  ) => {
    try {
      await transporter.sendMail({
        from: `Alquilcar Reservas <${EMAIL_USER}>`,
        to,
        subject,
        text,
        html,
      });
      console.log(`Message sent to ${to}`);
    } catch (error) {
      console.error('Server error');
    }
  };
}
