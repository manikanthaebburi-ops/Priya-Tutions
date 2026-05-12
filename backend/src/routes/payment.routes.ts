import express, { Router } from 'express';
import { PaymentController } from '../controllers/payment.controller';
import { verifyToken } from '../middleware/auth';

const router: Router = express.Router();

// Protected routes
router.post('/intent', verifyToken, PaymentController.createPaymentIntent);
router.post('/confirm', PaymentController.confirmPayment);
router.get('/history', verifyToken, PaymentController.getPaymentHistory);
router.get('/:id', PaymentController.getPaymentDetails);
router.post('/refund', verifyToken, PaymentController.processRefund);

export default router;
