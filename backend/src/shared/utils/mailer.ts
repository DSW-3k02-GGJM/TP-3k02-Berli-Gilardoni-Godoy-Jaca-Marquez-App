// Configuration
import { EMAIL_USER, EMAIL_PASSWORD } from '../../config.js';

// External Libraries
import nodemailer from 'nodemailer';

let transporter: nodemailer.Transporter;

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

transporter.verify();

export { transporter };
