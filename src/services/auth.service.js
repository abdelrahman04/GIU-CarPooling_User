import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();
const VERIFICATION_CODE_EXPIRY = 15 * 60 * 1000; // 15 minutes

class AuthService {
  async generateVerificationCode(userId, email) {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + VERIFICATION_CODE_EXPIRY);

    await prisma.verificationCode.create({
      data: {
        code,
        userId,
        email,
        expiresAt,
      },
    });

    return code;
  }

  async verifyCode(email, code) {
    const verificationCode = await prisma.verificationCode.findFirst({
      where: {
        email,
        code,
        expiresAt: { gt: new Date() },
        used: false,
      },
    });

    if (!verificationCode) {
      throw new Error('Invalid or expired verification code');
    }

    await prisma.verificationCode.update({
      where: { id: verificationCode.id },
      data: { used: true },
    });

    return true;
  }

  async hashPassword(password) {
    return bcrypt.hash(password, 10);
  }

  async comparePasswords(password, hashedPassword) {
    return bcrypt.compare(password, hashedPassword);
  }
}

export const authService = new AuthService(); 