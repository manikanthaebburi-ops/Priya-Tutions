import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/database';
import User from './User';
import TutorProfile from './TutorProfile';

class Availability extends Model {
  public id!: string;
  public tutorId!: string;
  public dayOfWeek!: number;
  public startTime!: string;
  public endTime!: string;
  public isAvailable!: boolean;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Availability.init(
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
        model: TutorProfile,
        key: 'id'
      }
    },
    dayOfWeek: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: '0=Sunday, 1=Monday, ..., 6=Saturday'
    },
    startTime: {
      type: DataTypes.TIME,
      allowNull: false
    },
    endTime: {
      type: DataTypes.TIME,
      allowNull: false
    },
    isAvailable: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  },
  {
    sequelize,
    tableName: 'availabilities'
  }
);

Availability.belongsTo(TutorProfile, { foreignKey: 'tutorId' });

export default Availability;
