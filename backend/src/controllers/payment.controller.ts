import { Request, Response } from 'express';
import { PaymentService } from '../services/payment.service';
import { AuthRequest } from '../middleware/auth';

export class PaymentController {
  /**
   * Create payment intent
   */
  static async createPaymentIntent(req: AuthRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Unauthorized'
        });
      }

      const { bookingId, amount } = req.body;

      if (!bookingId || !amount) {
        return res.status(400).json({
          success: false,
          message: 'bookingId and amount are required'
        });
      }

      const result = await PaymentService.createPaymentIntent(
        bookingId,
        parseFloat(amount),
        req.user.email
      );

      res.status(201).json({
        success: true,
        message: 'Payment intent created',
        data: result
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  /**
   * Confirm payment
   */
  static async confirmPayment(req: Request, res: Response) {
    try {
      const { paymentIntentId } = req.body;

      if (!paymentIntentId) {
        return res.status(400).json({
          success: false,
          message: 'paymentIntentId is required'
        });
      }

      const payment = await PaymentService.confirmPayment(paymentIntentId);

      res.json({
        success: true,
        message: 'Payment confirmed successfully',
        data: payment
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  /**
   * Get payment history
   */
  static async getPaymentHistory(req: AuthRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Unauthorized'
        });
      }

      const { page = 1, limit = 10 } = req.query;

      const result = await PaymentService.getPaymentHistory(
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
   * Get payment details
   */
  static async getPaymentDetails(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const payment = await PaymentService.getPaymentDetails(id);

      res.json({
        success: true,
        data: payment
      });
    } catch (error: any) {
      res.status(404).json({
        success: false,
        message: error.message
      });
    }
  }

  /**
   * Process refund
   */
  static async processRefund(req: AuthRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Unauthorized'
        });
      }

      const { paymentId } = req.body;

      if (!paymentId) {
        return res.status(400).json({
          success: false,
          message: 'paymentId is required'
        });
      }

      const result = await PaymentService.processRefund(paymentId);

      res.json({
        success: true,
        message: result.message,
        data: { refundId: result.refundId }
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }
}
