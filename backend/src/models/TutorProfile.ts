import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/database';
import User from './User';

class TutorProfile extends Model {
  public id!: string;
  public userId!: string;
  public bio!: string;
  public qualifications!: string[];
  public specializations!: string[];
  public hourlyRate!: number;
  public experience!: number;
  public totalStudents!: number;
  public averageRating!: number;
  public isApproved!: boolean;
  public certificateUrl?: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

TutorProfile.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      unique: true,
      references: {
        model: User,
        key: 'id'
      }
    },
    bio: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    qualifications: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      defaultValue: []
    },
    specializations: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      defaultValue: []
    },
    hourlyRate: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0
    },
    experience: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    totalStudents: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    averageRating: {
      type: DataTypes.DECIMAL(3, 2),
      defaultValue: 0
    },
    isApproved: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    certificateUrl: {
      type: DataTypes.STRING,
      allowNull: true
    }
  },
  {
    sequelize,
    tableName: 'tutor_profiles'
  }
);

TutorProfile.belongsTo(User, { foreignKey: 'userId' });

export default TutorProfile;
