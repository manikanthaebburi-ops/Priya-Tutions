import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/database';
import User from './User';
import TutorProfile from './TutorProfile';

class Booking extends Model {
  public id!: string;
  public studentId!: string;
  public tutorId!: string;
  public sessionDate!: Date;
  public startTime!: string;
  public endTime!: string;
  public subject!: string;
  public status!: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  public meetingLink?: string;
  public notes?: string;
  public totalPrice!: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Booking.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    studentId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: User,
        key: 'id'
      }
    },
    tutorId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: User,
        key: 'id'
      }
    },
    sessionDate: {
      type: DataTypes.DATE,
      allowNull: false
    },
    startTime: {
      type: DataTypes.TIME,
      allowNull: false
    },
    endTime: {
      type: DataTypes.TIME,
      allowNull: false
    },
    subject: {
      type: DataTypes.STRING,
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('pending', 'confirmed', 'completed', 'cancelled'),
      defaultValue: 'pending'
    },
    meetingLink: {
      type: DataTypes.STRING,
      allowNull: true
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    totalPrice: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    }
  },
  {
    sequelize,
    tableName: 'bookings'
  }
);

Booking.belongsTo(User, { foreignKey: 'studentId', as: 'student' });
Booking.belongsTo(User, { foreignKey: 'tutorId', as: 'tutor' });

export default Booking;
