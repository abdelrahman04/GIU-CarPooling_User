import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import prisma from '../lib/prisma.js';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;

class JWTService {
  async generateAccessToken(user) {
    console.log(user);
    // Check if user is a driver
    const driver = await prisma.driver.findUnique({
      where: { userId: user.id }
    });

    return jwt.sign(
      { 
        userId: user.id,
        email: user.email,
        isAdmin: user.isAdmin,
        isDriver: !!driver
      },
      JWT_SECRET,
      { expiresIn: '1d' }
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
      console.log('Verifying access token...');
      const decoded = jwt.verify(token, JWT_SECRET);
      console.log('Token decoded:', decoded);
      
      const user = await prisma.user.findUnique({
        where: { id: decoded.userId },
      });
      console.log('User found:', user ? 'Yes' : 'No');
      
      if (!user) {
        console.log('User not found for ID:', decoded.userId);
        throw new Error('User not found');
      }

      // Add isDriver field to user object
      const driver = await prisma.driver.findUnique({
        where: { userId: user.id }
      });
      
      return {
        ...user,
        isDriver: !!driver
      };
    } catch (error) {
      console.log('Token verification error:', error.message);
      if (error.name === 'JsonWebTokenError') {
        console.log('JWT Error:', error.message);
      } else if (error.name === 'TokenExpiredError') {
        console.log('Token expired');
      }
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