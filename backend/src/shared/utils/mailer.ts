// Configuration
import { EMAIL_USER, EMAIL_PASSWORD } from '../../config.js';

// External Libraries
import nodemailer from 'nodemailer';

let transporter: nodemailer.Transporter;

try {
  transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: EMAIL_USER,
      pass: EMAIL_PASSWORD,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  transporter
    .verify()
    .then(() => {
      logSuccessfulMessage();
    })
    .catch(() => {
      logError();
    });
} catch (error) {
  logError();
}

function logSuccessfulMessage() {
  console.log('\nReady to send emails');
}

function logError() {
  console.error(
    '\nMail Service is not working:\nError verifying email transporter'
  );
}

export { transporter };
