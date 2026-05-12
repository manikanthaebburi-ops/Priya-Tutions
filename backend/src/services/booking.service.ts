import Booking from '../models/Booking';
import Payment from '../models/Payment';
import TutorProfile from '../models/TutorProfile';
import User from '../models/User';
import { Op } from 'sequelize';

export class BookingService {
  /**
   * Create a new booking
   */
  static async createBooking(
    studentId: string,
    {
      tutorId,
      sessionDate,
      startTime,
      endTime,
      subject,
      notes
    }: any
  ) {
    try {
      // Validate tutor exists
      const tutorUser = await User.findByPk(tutorId);
      if (!tutorUser) {
        throw new Error('Tutor not found');
      }

      const tutorProfile = await TutorProfile.findOne({
        where: { userId: tutorId }
      });
      if (!tutorProfile) {
        throw new Error('Tutor profile not found');
      }

      // Calculate total price based on hourly rate
      const startHour = parseInt(startTime.split(':')[0]);
      const endHour = parseInt(endTime.split(':')[0]);
      const durationHours = endHour - startHour;
      const totalPrice =
        parseFloat(tutorProfile.hourlyRate.toString()) * durationHours;

      // Create booking
      const booking = await Booking.create({
        studentId,
        tutorId,
        sessionDate: new Date(sessionDate),
        startTime,
        endTime,
        subject,
        notes,
        totalPrice,
        status: 'pending'
      });

      return booking;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to create booking');
    }
  }

  /**
   * Get bookings for a user
   */
  static async getUserBookings(userId: string, page = 1, limit = 10) {
    try {
      const offset = (page - 1) * limit;

      const { count, rows } = await Booking.findAndCountAll({
        where: {
          [Op.or]: [
            { studentId: userId },
            { tutorId: userId }
          ]
        },
        include: [
          {
            model: User,
            as: 'student',
            attributes: ['id', 'firstName', 'lastName', 'email', 'profilePicture']
          },
          {
            model: User,
            as: 'tutor',
            attributes: ['id', 'firstName', 'lastName', 'email', 'profilePicture']
          },
          {
            model: Payment,
            required: false
          }
        ],
        limit,
        offset,
        order: [['sessionDate', 'DESC']]
      });

      return {
        bookings: rows,
        total: count,
        pages: Math.ceil(count / limit),
        currentPage: page
      };
    } catch (error: any) {
      throw new Error(error.message || 'Failed to fetch bookings');
    }
  }

  /**
   * Get booking details
   */
  static async getBookingById(bookingId: string) {
    try {
      const booking = await Booking.findByPk(bookingId, {
        include: [
          {
            model: User,
            as: 'student',
            attributes: ['id', 'firstName', 'lastName', 'email', 'phone']
          },
          {
            model: User,
            as: 'tutor',
            attributes: ['id', 'firstName', 'lastName', 'email', 'phone']
          },
          {
            model: Payment
          }
        ]
      });

      if (!booking) {
        throw new Error('Booking not found');
      }

      return booking;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to fetch booking');
    }
  }

  /**
   * Update booking
   */
  static async updateBooking(bookingId: string, updates: any) {
    try {
      const booking = await Booking.findByPk(bookingId);

      if (!booking) {
        throw new Error('Booking not found');
      }

      await booking.update({
        sessionDate: updates.sessionDate || booking.sessionDate,
        startTime: updates.startTime || booking.startTime,
        endTime: updates.endTime || booking.endTime,
        subject: updates.subject || booking.subject,
        notes: updates.notes || booking.notes,
        meetingLink: updates.meetingLink || booking.meetingLink
      });

      return booking;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to update booking');
    }
  }

  /**
   * Cancel booking
   */
  static async cancelBooking(bookingId: string) {
    try {
      const booking = await Booking.findByPk(bookingId);

      if (!booking) {
        throw new Error('Booking not found');
      }

      if (booking.status === 'completed' || booking.status === 'cancelled') {
        throw new Error(`Cannot cancel a ${booking.status} booking`);
      }

      await booking.update({ status: 'cancelled' });

      return { message: 'Booking cancelled successfully' };
    } catch (error: any) {
      throw new Error(error.message || 'Failed to cancel booking');
    }
  }

  /**
   * Confirm booking
   */
  static async confirmBooking(bookingId: string) {
    try {
      const booking = await Booking.findByPk(bookingId);

      if (!booking) {
        throw new Error('Booking not found');
      }

      await booking.update({ status: 'confirmed' });

      return booking;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to confirm booking');
    }
  }

  /**
   * Mark booking as completed
   */
  static async completeBooking(bookingId: string) {
    try {
      const booking = await Booking.findByPk(bookingId);

      if (!booking) {
        throw new Error('Booking not found');
      }

      await booking.update({ status: 'completed' });

      return booking;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to complete booking');
    }
  }
}
