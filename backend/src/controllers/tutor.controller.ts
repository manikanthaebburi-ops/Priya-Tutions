import { Request, Response } from 'express';
import { TutorService } from '../services/tutor.service';
import { AuthRequest } from '../middleware/auth';

export class TutorController {
  /**
   * Create tutor profile
   */
  static async createProfile(req: AuthRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Unauthorized'
        });
      }

      const profile = await TutorService.createProfile(req.user.id, req.body);

      res.status(201).json({
        success: true,
        message: 'Tutor profile created successfully',
        data: profile
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  /**
   * Update tutor profile
   */
  static async updateProfile(req: AuthRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Unauthorized'
        });
      }

      const profile = await TutorService.updateProfile(req.user.id, req.body);

      res.json({
        success: true,
        message: 'Tutor profile updated successfully',
        data: profile
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  /**
   * Get tutor profile
   */
  static async getProfile(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const profile = await TutorService.getProfileById(id);

      res.json({
        success: true,
        data: profile
      });
    } catch (error: any) {
      res.status(404).json({
        success: false,
        message: error.message
      });
    }
  }

  /**
   * Get all tutors with filters
   */
  static async getAllTutors(req: Request, res: Response) {
    try {
      const { page = 1, limit = 10, specialization, minRating, maxRate } = req.query;

      const result = await TutorService.getAllTutors({
        page: parseInt(page as string),
        limit: parseInt(limit as string),
        specialization,
        minRating: minRating ? parseInt(minRating as string) : 0,
        maxRate: maxRate ? parseInt(maxRate as string) : null
      });

      res.json({
        success: true,
        data: result
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  /**
   * Add availability
   */
  static async addAvailability(req: AuthRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Unauthorized'
        });
      }

      const availability = await TutorService.addAvailability(
        req.user.id,
        req.body
      );

      res.status(201).json({
        success: true,
        message: 'Availability added successfully',
        data: availability
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  /**
   * Get availability
   */
  static async getAvailability(req: AuthRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Unauthorized'
        });
      }

      const availability = await TutorService.getAvailability(req.user.id);

      res.json({
        success: true,
        data: availability
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  /**
   * Get tutor reviews
   */
  static async getReviews(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { page = 1, limit = 10 } = req.query;

      const result = await TutorService.getReviews(
        id,
        parseInt(page as string),
        parseInt(limit as string)
      );

      res.json({
        success: true,
        data: result
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  /**
   * Delete availability
   */
  static async deleteAvailability(req: AuthRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Unauthorized'
        });
      }

      const { availabilityId } = req.params;

      const result = await TutorService.deleteAvailability(availabilityId);

      res.json({
        success: true,
        message: result.message
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }
}
