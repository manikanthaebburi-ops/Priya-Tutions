import User from './User';
import TutorProfile from './TutorProfile';
import Availability from './Availability';
import Booking from './Booking';
import Payment from './Payment';
import Review from './Review';

// Export all models
export {
  User,
  TutorProfile,
  Availability,
  Booking,
  Payment,
  Review
};

// Define associations
export const initializeAssociations = () => {
  // User associations
  User.hasOne(TutorProfile, { foreignKey: 'userId' });
  User.hasMany(Booking, { foreignKey: 'studentId', as: 'studentBookings' });
  User.hasMany(Booking, { foreignKey: 'tutorId', as: 'tutorBookings' });
  User.hasMany(Review, { foreignKey: 'studentId', as: 'studentReviews' });
  User.hasMany(Review, { foreignKey: 'tutorId', as: 'tutorReviews' });

  // TutorProfile associations
  TutorProfile.hasMany(Availability, { foreignKey: 'tutorId' });

  // Booking associations
  Booking.hasOne(Payment, { foreignKey: 'bookingId' });
  Booking.hasOne(Review, { foreignKey: 'bookingId' });
};
