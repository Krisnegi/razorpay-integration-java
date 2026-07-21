import bcrypt from 'bcryptjs';
import jwt, { Secret, SignOptions } from 'jsonwebtoken';
import { prisma } from '../config/prisma';
import { AppError } from '../middleware/error';

export class AuthService {
  public static generateToken(user: { id: number; email: string; role: string }): string {
    const secret: Secret = process.env.JWT_SECRET || 'fallback_secret';
    const expiresIn: string = process.env.JWT_EXPIRES_IN || '7d';
    
    const options: SignOptions = { expiresIn: expiresIn as any };
    return jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      secret,
      options
    );
  }

  public static async register(data: {
    name: string;
    email: string;
    password: string;
    phone?: string | null;
  }) {
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      throw new AppError('Email address is already registered', 400);
    }

    const hashedPassword = await bcrypt.hash(data.password, 12);

    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: hashedPassword,
        phone: data.phone,
      },
    });

    const token = this.generateToken(user);

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        createdAt: user.createdAt,
      },
      token,
    };
  }

  public static async login(data: { email: string; password: string }) {
    const user = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (!user) {
      throw new AppError('Invalid email or password', 401);
    }

    const isPasswordValid = await bcrypt.compare(data.password, user.password);
    if (!isPasswordValid) {
      throw new AppError('Invalid email or password', 401);
    }

    const token = this.generateToken(user);

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        createdAt: user.createdAt,
      },
      token,
    };
  }

  public static async getProfile(userId: number) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      throw new AppError('User not found', 404);
    }

    return user;
  }
}
