import express, { Router } from 'express';
import { BookingController } from '../controllers/booking.controller';
import { verifyToken } from '../middleware/auth';

const router: Router = express.Router();

// Protected routes
router.post('/', verifyToken, BookingController.createBooking);
router.get('/', verifyToken, BookingController.getUserBookings);
router.get('/:id', BookingController.getBookingDetails);
router.put('/:id', verifyToken, BookingController.updateBooking);
router.delete('/:id', verifyToken, BookingController.cancelBooking);
router.put('/:id/confirm', verifyToken, BookingController.confirmBooking);
router.put('/:id/complete', verifyToken, BookingController.completeBooking);

export default router;
