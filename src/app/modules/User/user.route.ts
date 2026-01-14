import express from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { UserValidation } from './user.validation';
import { UserControllers } from './user.controller';
import { USER_ROLE } from '../Auth/auth.utils';

const router = express.Router();

// Get user profile (Protected)
router.get(
  '/profile',
  auth(USER_ROLE.user, USER_ROLE.admin),
  UserControllers.getUserProfile,
);

// Update user profile (Protected)
router.put(
  '/profile',
  auth(USER_ROLE.user, USER_ROLE.admin),
  validateRequest(UserValidation.updateProfileValidationSchema),
  UserControllers.updateUserProfile,
);

// Change password (Protected)
router.put(
  '/change-password',
  auth(USER_ROLE.user, USER_ROLE.admin),
  validateRequest(UserValidation.changePasswordValidationSchema),
  UserControllers.changePassword,
);

export const UserRoutes = router;
