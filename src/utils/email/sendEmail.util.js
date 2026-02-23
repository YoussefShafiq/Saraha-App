// utils/sendEmail.js
import nodemailer from 'nodemailer'
import { EMAIL_PASS, EMAIL_USER } from '../../../configs/app.config.js';

export const sendEmail = async (email, otp) => {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: EMAIL_USER,
            pass: EMAIL_PASS,
        },
    });

    await transporter.sendMail({
        from: EMAIL_USER,
        to: email,
        subject: "Verify Your Email",
        text: `Your OTP is: ${otp}`,
    });
};

