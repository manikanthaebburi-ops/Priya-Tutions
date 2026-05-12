import jwt from 'jsonwebtoken';
import User from '../models/User';
import { sequelize } from '../config/database';

export interface IAuthPayload {
  id: string;
  email: string;
  role: string;
}

export class AuthService {
  /**
   * Generate JWT tokens
   */
  static generateTokens(payload: IAuthPayload) {
    const accessToken = jwt.sign(
      payload,
      process.env.JWT_SECRET || 'secret',
      { expiresIn: process.env.JWT_EXPIRE || '7d' }
    );

    const refreshToken = jwt.sign(
      payload,
      process.env.JWT_REFRESH_SECRET || 'refresh_secret',
      { expiresIn: process.env.JWT_REFRESH_EXPIRE || '30d' }
    );

    return { accessToken, refreshToken };
  }

  /**
   * Register a new user
   */
  static async register({
    email,
    password,
    firstName,
    lastName,
    role = 'student',
    phone
  }: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    role?: 'student' | 'tutor';
    phone?: string;
  }) {
    try {
      // Check if user already exists
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        throw new Error('User with this email already exists');
      }

      // Create new user
      const user = await User.create({
        email,
        password,
        firstName,
        lastName,
        role,
        phone
      });

      // Generate tokens
      const tokens = this.generateTokens({
        id: user.id,
        email: user.email,
        role: user.role
      });

      return {
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          phone: user.phone
        },
        ...tokens
      };
    } catch (error: any) {
      throw new Error(error.message || 'Registration failed');
    }
  }

  /**
   * Login user
   */
  static async login(email: string, password: string) {
    try {
      const user = await User.findOne({ where: { email } });

      if (!user) {
        throw new Error('Invalid email or password');
      }

      const isPasswordValid = await user.validatePassword(password);
      if (!isPasswordValid) {
        throw new Error('Invalid email or password');
      }

      if (!user.isActive) {
        throw new Error('Your account has been deactivated');
      }

      const tokens = this.generateTokens({
        id: user.id,
        email: user.email,
        role: user.role
      });

      return {
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          phone: user.phone,
          profilePicture: user.profilePicture
        },
        ...tokens
      };
    } catch (error: any) {
      throw new Error(error.message || 'Login failed');
    }
  }

  /**
   * Refresh access token
   */
  static async refreshToken(refreshToken: string) {
    try {
      const decoded = jwt.verify(
        refreshToken,
        process.env.JWT_REFRESH_SECRET || 'refresh_secret'
      ) as IAuthPayload;

      const user = await User.findByPk(decoded.id);
      if (!user || !user.isActive) {
        throw new Error('User not found or inactive');
      }

      const tokens = this.generateTokens({
        id: user.id,
        email: user.email,
        role: user.role
      });

      return tokens;
    } catch (error: any) {
      throw new Error('Invalid refresh token');
    }
  }

  /**
   * Get user profile
   */
  static async getUserProfile(userId: string) {
    try {
      const user = await User.findByPk(userId);
      if (!user) {
        throw new Error('User not found');
      }

      return {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        phone: user.phone,
        profilePicture: user.profilePicture,
        emailVerified: user.emailVerified,
        isActive: user.isActive
      };
    } catch (error: any) {
      throw new Error(error.message || 'Failed to get user profile');
    }
  }

  /**
   * Update user profile
   */
  static async updateProfile(
    userId: string,
    { firstName, lastName, phone, profilePicture }: any
  ) {
    try {
      const user = await User.findByPk(userId);
      if (!user) {
        throw new Error('User not found');
      }

      await user.update({
        firstName: firstName || user.firstName,
        lastName: lastName || user.lastName,
        phone: phone || user.phone,
        profilePicture: profilePicture || user.profilePicture
      });

      return {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        phone: user.phone,
        profilePicture: user.profilePicture
      };
    } catch (error: any) {
      throw new Error(error.message || 'Failed to update profile');
    }
  }

  /**
   * Change password
   */
  static async changePassword(
    userId: string,
    currentPassword: string,
    newPassword: string
  ) {
    try {
      const user = await User.findByPk(userId);
      if (!user) {
        throw new Error('User not found');
      }

      const isPasswordValid = await user.validatePassword(currentPassword);
      if (!isPasswordValid) {
        throw new Error('Current password is incorrect');
      }

      user.password = newPassword;
      await user.save();

      return { message: 'Password changed successfully' };
    } catch (error: any) {
      throw new Error(error.message || 'Failed to change password');
    }
  }
}
