import TutorProfile from '../models/TutorProfile';
import Availability from '../models/Availability';
import User from '../models/User';
import Review from '../models/Review';
import { Op } from 'sequelize';

export class TutorService {
  /**
   * Create tutor profile
   */
  static async createProfile(
    userId: string,
    {
      bio,
      qualifications,
      specializations,
      hourlyRate,
      experience,
      certificateUrl
    }: any
  ) {
    try {
      const existingProfile = await TutorProfile.findOne({
        where: { userId }
      });

      if (existingProfile) {
        throw new Error('Tutor profile already exists for this user');
      }

      const profile = await TutorProfile.create({
        userId,
        bio,
        qualifications: qualifications || [],
        specializations: specializations || [],
        hourlyRate: parseFloat(hourlyRate),
        experience: parseInt(experience) || 0,
        certificateUrl,
        isApproved: false
      });

      return profile;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to create tutor profile');
    }
  }

  /**
   * Update tutor profile
   */
  static async updateProfile(userId: string, updates: any) {
    try {
      const profile = await TutorProfile.findOne({ where: { userId } });

      if (!profile) {
        throw new Error('Tutor profile not found');
      }

      await profile.update({
        bio: updates.bio || profile.bio,
        qualifications: updates.qualifications || profile.qualifications,
        specializations: updates.specializations || profile.specializations,
        hourlyRate: updates.hourlyRate
          ? parseFloat(updates.hourlyRate)
          : profile.hourlyRate,
        experience: updates.experience
          ? parseInt(updates.experience)
          : profile.experience,
        certificateUrl: updates.certificateUrl || profile.certificateUrl
      });

      return profile;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to update tutor profile');
    }
  }

  /**
   * Get tutor profile by ID
   */
  static async getProfileById(tutorId: string) {
    try {
      const profile = await TutorProfile.findOne({
        where: { userId: tutorId },
        include: [
          {
            model: User,
            attributes: ['id', 'email', 'firstName', 'lastName', 'profilePicture', 'phone']
          },
          {
            model: Availability
          }
        ]
      });

      if (!profile) {
        throw new Error('Tutor profile not found');
      }

      return profile;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to fetch tutor profile');
    }
  }

  /**
   * Get all tutors with filters
   */
  static async getAllTutors({
    page = 1,
    limit = 10,
    specialization,
    minRating = 0,
    maxRate = null
  }: any = {}) {
    try {
      const offset = (page - 1) * limit;
      const where: any = { isApproved: true };
      const include: any = [{ model: User, attributes: ['email', 'firstName', 'lastName', 'profilePicture'] }];

      if (specialization) {
        where.specializations = {
          [Op.contains]: [specialization]
        };
      }

      if (minRating > 0) {
        where.averageRating = {
          [Op.gte]: minRating
        };
      }

      if (maxRate) {
        where.hourlyRate = {
          [Op.lte]: maxRate
        };
      }

      const { count, rows } = await TutorProfile.findAndCountAll({
        where,
        include,
        limit,
        offset,
        order: [['averageRating', 'DESC']]
      });

      return {
        tutors: rows,
        total: count,
        pages: Math.ceil(count / limit),
        currentPage: page
      };
    } catch (error: any) {
      throw new Error(error.message || 'Failed to fetch tutors');
    }
  }

  /**
   * Add availability slot
   */
  static async addAvailability(
    tutorId: string,
    { dayOfWeek, startTime, endTime }: any
  ) {
    try {
      const profile = await TutorProfile.findOne({ where: { userId: tutorId } });

      if (!profile) {
        throw new Error('Tutor profile not found');
      }

      const availability = await Availability.create({
        tutorId: profile.id,
        dayOfWeek: parseInt(dayOfWeek),
        startTime,
        endTime,
        isAvailable: true
      });

      return availability;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to add availability');
    }
  }

  /**
   * Get tutor availability
   */
  static async getAvailability(tutorId: string) {
    try {
      const profile = await TutorProfile.findOne({ where: { userId: tutorId } });

      if (!profile) {
        throw new Error('Tutor profile not found');
      }

      const availability = await Availability.findAll({
        where: { tutorId: profile.id },
        order: [['dayOfWeek', 'ASC']]
      });

      return availability;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to fetch availability');
    }
  }

  /**
   * Get tutor reviews
   */
  static async getReviews(tutorId: string, page = 1, limit = 10) {
    try {
      const offset = (page - 1) * limit;

      const { count, rows } = await Review.findAndCountAll({
        where: { tutorId },
        include: [
          {
            model: User,
            as: 'student',
            attributes: ['id', 'firstName', 'lastName', 'profilePicture']
          }
        ],
        limit,
        offset,
        order: [['createdAt', 'DESC']]
      });

      return {
        reviews: rows,
        total: count,
        pages: Math.ceil(count / limit),
        currentPage: page
      };
    } catch (error: any) {
      throw new Error(error.message || 'Failed to fetch reviews');
    }
  }

  /**
   * Delete availability slot
   */
  static async deleteAvailability(availabilityId: string) {
    try {
      const availability = await Availability.findByPk(availabilityId);

      if (!availability) {
        throw new Error('Availability slot not found');
      }

      await availability.destroy();
      return { message: 'Availability slot deleted' };
    } catch (error: any) {
      throw new Error(error.message || 'Failed to delete availability');
    }
  }
}
