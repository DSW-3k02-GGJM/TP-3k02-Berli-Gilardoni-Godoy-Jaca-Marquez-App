import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

let transporter: nodemailer.Transporter;

try {
    transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true, // true for port 465, false for other ports
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD,
        },
    });

    transporter.verify().then(() => {
        console.log('Ready for send emails');
    }).catch((error) => {
        console.error('Error verifying email transporter');
    });
} catch (error) {
    console.error('Error creating email transporter');
}

export { transporter };