import { Request, Response } from 'express';
import { BookingService } from '../services/booking.service';
import { AuthRequest } from '../middleware/auth';

export class BookingController {
  /**
   * Create booking
   */
  static async createBooking(req: AuthRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Unauthorized'
        });
      }

      const booking = await BookingService.createBooking(req.user.id, req.body);

      res.status(201).json({
        success: true,
        message: 'Booking created successfully',
        data: booking
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  /**
   * Get user bookings
   */
  static async getUserBookings(req: AuthRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Unauthorized'
        });
      }

      const { page = 1, limit = 10 } = req.query;

      const result = await BookingService.getUserBookings(
        req.user.id,
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
   * Get booking details
   */
  static async getBookingDetails(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const booking = await BookingService.getBookingById(id);

      res.json({
        success: true,
        data: booking
      });
    } catch (error: any) {
      res.status(404).json({
        success: false,
        message: error.message
      });
    }
  }

  /**
   * Update booking
   */
  static async updateBooking(req: AuthRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Unauthorized'
        });
      }

      const { id } = req.params;

      const booking = await BookingService.updateBooking(id, req.body);

      res.json({
        success: true,
        message: 'Booking updated successfully',
        data: booking
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  /**
   * Cancel booking
   */
  static async cancelBooking(req: AuthRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Unauthorized'
        });
      }

      const { id } = req.params;

      const result = await BookingService.cancelBooking(id);

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

  /**
   * Confirm booking
   */
  static async confirmBooking(req: AuthRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Unauthorized'
        });
      }

      const { id } = req.params;

      const booking = await BookingService.confirmBooking(id);

      res.json({
        success: true,
        message: 'Booking confirmed successfully',
        data: booking
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  /**
   * Complete booking
   */
  static async completeBooking(req: AuthRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Unauthorized'
        });
      }

      const { id } = req.params;

      const booking = await BookingService.completeBooking(id);

      res.json({
        success: true,
        message: 'Booking marked as completed',
        data: booking
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }
}
