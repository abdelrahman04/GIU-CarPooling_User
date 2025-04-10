import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;

class JWTService {
  async generateAccessToken(user) {
    return jwt.sign(
      { 
        userId: user.id,
        email: user.email,
        isAdmin: user.isAdmin 
      },
      JWT_SECRET,
      { expiresIn: '15m' }
    );
  }

  async generateRefreshToken(user) {
    const token = jwt.sign(
      { userId: user.id },
      JWT_REFRESH_SECRET,
      { expiresIn: '7d' }
    );

    // Store refresh token in database
    await prisma.refreshToken.create({
      data: {
        token,
        userId: user.id,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      },
    });

    return token;
  }

  async verifyAccessToken(token) {
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      const user = await prisma.user.findUnique({
        where: { id: decoded.userId },
      });
      if (!user) throw new Error('User not found');
      return user;
    } catch (error) {
      throw new Error('Invalid access token');
    }
  }

  async verifyRefreshToken(token) {
    try {
      const decoded = jwt.verify(token, JWT_REFRESH_SECRET);
      const storedToken = await prisma.refreshToken.findFirst({
        where: {
          token,
          userId: decoded.userId,
          expiresAt: { gt: new Date() },
        },
      });
      if (!storedToken) throw new Error('Invalid refresh token');
      return decoded;
    } catch (error) {
      throw new Error('Invalid refresh token');
    }
  }

  async revokeRefreshToken(token) {
    await prisma.refreshToken.delete({
      where: { token },
    });
  }
}

export const jwtService = new JWTService(); 