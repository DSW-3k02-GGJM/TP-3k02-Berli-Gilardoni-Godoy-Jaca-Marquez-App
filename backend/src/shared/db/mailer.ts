import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

let transporter: nodemailer.Transporter;

try {
  transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, // true for port 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
    tls: {
      rejectUnauthorized: false, // Ignorar certificados autofirmados
    },
  });

  transporter
    .verify()
    .then(() => {
      console.log('Ready to send emails');
    })
    .catch((error) => {
      console.error(
        'Mail Service is not working:\n\tError verifying email transporter'
      );
    });
} catch (error) {
  console.error(
    'Mail Service is not working:\n\tError creating email transporter'
  );
}

export { transporter };
