import express, { Router } from 'express';
import { TutorController } from '../controllers/tutor.controller';
import { verifyToken } from '../middleware/auth';

const router: Router = express.Router();

// Public routes
router.get('/', TutorController.getAllTutors);
router.get('/:id', TutorController.getProfile);
router.get('/:id/reviews', TutorController.getReviews);

// Protected routes (tutor only)
router.post('/profile', verifyToken, TutorController.createProfile);
router.put('/profile', verifyToken, TutorController.updateProfile);
router.post('/availability', verifyToken, TutorController.addAvailability);
router.get('/availability', verifyToken, TutorController.getAvailability);
router.delete('/availability/:availabilityId', verifyToken, TutorController.deleteAvailability);

export default router;
