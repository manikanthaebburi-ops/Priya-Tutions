import stripe from '../config/stripe';
import Payment from '../models/Payment';
import Booking from '../models/Booking';

export class PaymentService {
  /**
   * Create Stripe payment intent
   */
  static async createPaymentIntent(
    bookingId: string,
    amount: number,
    email: string
  ) {
    try {
      const booking = await Booking.findByPk(bookingId);
      if (!booking) {
        throw new Error('Booking not found');
      }

      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Convert to cents
        currency: 'usd',
        metadata: {
          bookingId: bookingId,
          studentId: booking.studentId,
          tutorId: booking.tutorId
        },
        receipt_email: email
      });

      // Create payment record
      const payment = await Payment.create({
        bookingId,
        amount,
        currency: 'USD',
        status: 'pending',
        stripeIntentId: paymentIntent.id
      });

      return {
        clientSecret: paymentIntent.client_secret,
        paymentId: payment.id,
        intentId: paymentIntent.id
      };
    } catch (error: any) {
      throw new Error(error.message || 'Failed to create payment intent');
    }
  }

  /**
   * Confirm payment
   */
  static async confirmPayment(paymentIntentId: string) {
    try {
      const paymentIntent = await stripe.paymentIntents.retrieve(
        paymentIntentId
      );

      if (paymentIntent.status !== 'succeeded') {
        throw new Error('Payment not successful');
      }

      const payment = await Payment.findOne({
        where: { stripeIntentId: paymentIntentId }
      });

      if (!payment) {
        throw new Error('Payment record not found');
      }

      await payment.update({
        status: 'succeeded',
        transactionId: paymentIntent.id,
        stripePaymentMethodId: paymentIntent.payment_method as string
      });

      // Update booking status to confirmed
      const booking = await Booking.findByPk(payment.bookingId);
      if (booking) {
        await booking.update({ status: 'confirmed' });
      }

      return payment;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to confirm payment');
    }
  }

  /**
   * Get payment history
   */
  static async getPaymentHistory(userId: string, page = 1, limit = 10) {
    try {
      const offset = (page - 1) * limit;

      const { count, rows } = await Payment.findAndCountAll({
        include: [
          {
            model: Booking,
            where: {
              [require('sequelize').Op.or]: [
                { studentId: userId },
                { tutorId: userId }
              ]
            },
            required: true
          }
        ],
        limit,
        offset,
        order: [['createdAt', 'DESC']]
      });

      return {
        payments: rows,
        total: count,
        pages: Math.ceil(count / limit),
        currentPage: page
      };
    } catch (error: any) {
      throw new Error(error.message || 'Failed to fetch payment history');
    }
  }

  /**
   * Process refund
   */
  static async processRefund(paymentId: string) {
    try {
      const payment = await Payment.findByPk(paymentId);

      if (!payment) {
        throw new Error('Payment not found');
      }

      if (!payment.stripeIntentId) {
        throw new Error('No Stripe payment intent found');
      }

      const refund = await stripe.refunds.create({
        payment_intent: payment.stripeIntentId
      });

      await payment.update({
        status: 'refunded'
      });

      return {
        message: 'Refund processed successfully',
        refundId: refund.id
      };
    } catch (error: any) {
      throw new Error(error.message || 'Failed to process refund');
    }
  }

  /**
   * Get payment details
   */
  static async getPaymentDetails(paymentId: string) {
    try {
      const payment = await Payment.findByPk(paymentId, {
        include: [Booking]
      });

      if (!payment) {
        throw new Error('Payment not found');
      }

      return payment;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to fetch payment details');
    }
  }
}
