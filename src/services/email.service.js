import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const EMAIL_USER = process.env.EMAIL_USER;
const EMAIL_PASS = process.env.EMAIL_PASS;

class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASS,
      },
    });
  }

  async sendVerificationCode(email, code) {
    const mailOptions = {
      from: EMAIL_USER,
      to: email,
      subject: 'Your Verification Code',
      html: `
        <h1>Verification Code</h1>
        <p>Your verification code is: <strong>${code}</strong></p>
        <p>This code will expire in 15 minutes.</p>
      `,
    };

    await this.transporter.sendMail(mailOptions);
  }

  async sendVerificationEmail(email, code) {
    const mailOptions = {
      from: EMAIL_USER,
      to: email,
      subject: 'Email Verification',
      html: `
        <h1>Email Verification</h1>
        <p>Thank you for registering. Please use the following code to verify your email:</p>
        <p><strong>${code}</strong></p>
        <p>This code will expire in 15 minutes.</p>
        <p>If you did not register for this account, please ignore this email.</p>
      `,
    };

    await this.transporter.sendMail(mailOptions);
  }

  async sendLoginVerificationEmail(email, code) {
    const mailOptions = {
      from: EMAIL_USER,
      to: email,
      subject: 'Login Verification',
      html: `
        <h1>Login Verification</h1>
        <p>You have requested to log in. Please use the following code to complete the login process:</p>
        <p><strong>${code}</strong></p>
        <p>This code will expire in 15 minutes.</p>
        <p>If you did not attempt to log in, please ignore this email and secure your account.</p>
      `,
    };

    await this.transporter.sendMail(mailOptions);
  }
}

export const emailService = new EmailService(); 