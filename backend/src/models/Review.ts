import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/database';
import User from './User';
import Booking from './Booking';

class Review extends Model {
  public id!: string;
  public tutorId!: string;
  public studentId!: string;
  public bookingId!: string;
  public rating!: number;
  public comment!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Review.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    tutorId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: User,
        key: 'id'
      }
    },
    studentId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: User,
        key: 'id'
      }
    },
    bookingId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: Booking,
        key: 'id'
      }
    },
    rating: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: { min: 1, max: 5 }
    },
    comment: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  },
  {
    sequelize,
    tableName: 'reviews'
  }
);

Review.belongsTo(User, { foreignKey: 'tutorId', as: 'tutor' });
Review.belongsTo(User, { foreignKey: 'studentId', as: 'student' });
Review.belongsTo(Booking, { foreignKey: 'bookingId' });

export default Review;
