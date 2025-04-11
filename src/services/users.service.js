import { authService } from './auth.service.js';
import { jwtService } from './jwt.service.js';
import { emailService } from './email.service.js';
import { BadRequestException, NotFoundException } from '../exceptions/index.js';
import prisma from '../lib/prisma.js';

class UsersService {
  async register(input) {
    const { email, password, firstName, lastName, giuId, phone, gender } = input;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      throw new BadRequestException('User already exists');
    }

    // Hash password
    const hashedPassword = await authService.hashPassword(password);

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        firstName,
        lastName,
        giuId,
        phone,
        gender,
        isAdmin: false,
        isEmailVerified: false,
        activated: false
      }
    });

    // Generate verification code
    const code = await authService.generateVerificationCode(user.id, email);

    // Send verification email
    await emailService.sendVerificationEmail(email, code);

    return { message: 'Registration successful. Please check your email for verification code.' };
  }

  async verifyRegistration(input) {
    const { email, code } = input;

    // Verify code
    await authService.verifyCode(email, code);

    // Update user
    await prisma.user.update({
      where: { email },
      data: { isEmailVerified: true }
    });

    return { message: 'Email verified successfully.' };
  }

  async login(input) {
    const { email, password } = input;

    // Find user
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Check password
    const isPasswordValid = await authService.comparePasswords(password, user.password);
    if (!isPasswordValid) {
      throw new BadRequestException('Invalid password');
    }

    // Check if email is verified
    if (!user.isEmailVerified) {
      throw new BadRequestException('Email not verified');
    }

    // Generate verification code for login
    const code = await authService.generateVerificationCode(user.id, email);

    // Send verification email
    await emailService.sendLoginVerificationEmail(email, code);

    return { message: 'Login verification code sent to your email.' };
  }

  async verifyLogin(input) {
    const { email, code } = input;

    // Find user
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Verify code
    await authService.verifyCode(email, code);

    // Generate tokens
    const accessToken = await jwtService.generateAccessToken(user);
    const refreshToken = await jwtService.generateRefreshToken(user);

    return {
      accessToken,
      refreshToken,
      user
    };
  }

  async refreshToken(token) {
    // Verify refresh token
    const decoded = await jwtService.verifyRefreshToken(token);

    // Find user
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId }
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Generate new tokens
    const accessToken = await jwtService.generateAccessToken(user);
    const refreshToken = await jwtService.generateRefreshToken(user);

    return {
      accessToken,
      refreshToken,
      user
    };
  }

  async revokeToken(token) {
    // Revoke refresh token
    await jwtService.revokeRefreshToken(token);
    return true;
  }

  async getProfile(userId) {
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }
}

export const usersService = new UsersService(); 