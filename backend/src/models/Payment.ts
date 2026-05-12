import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/database';
import Booking from './Booking';
import Stripe from 'stripe';

class Payment extends Model {
  public id!: string;
  public bookingId!: string;
  public amount!: number;
  public currency!: string;
  public status!: 'pending' | 'succeeded' | 'failed' | 'refunded';
  public stripeIntentId?: string;
  public stripePaymentMethodId?: string;
  public transactionId?: string;
  public paymentMethod!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Payment.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    bookingId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: Booking,
        key: 'id'
      }
    },
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    currency: {
      type: DataTypes.STRING,
      defaultValue: 'USD'
    },
    status: {
      type: DataTypes.ENUM('pending', 'succeeded', 'failed', 'refunded'),
      defaultValue: 'pending'
    },
    stripeIntentId: {
      type: DataTypes.STRING,
      allowNull: true
    },
    stripePaymentMethodId: {
      type: DataTypes.STRING,
      allowNull: true
    },
    transactionId: {
      type: DataTypes.STRING,
      allowNull: true
    },
    paymentMethod: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'stripe'
    }
  },
  {
    sequelize,
    tableName: 'payments'
  }
);

Payment.belongsTo(Booking, { foreignKey: 'bookingId' });

export default Payment;
