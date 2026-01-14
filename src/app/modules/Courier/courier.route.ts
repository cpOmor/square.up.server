
import { Router } from 'express';
import { CourierController } from './courier.controller';
import { CourierValidation } from './courier.validation';
import validateRequest from '../../middlewares/validateRequest';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../Auth/auth.utils';

const router = Router();

// Create a new courier entry (AI-powered parsing)
router.post(
  '/create-courier',
  auth(USER_ROLE.user),
  validateRequest(CourierValidation.createCourierEntryValidationSchema),
  CourierController.createCourierEntry
);

// Get all courier entries for the authenticated user
router.get(
  '/',
  auth(USER_ROLE.user),
  CourierController.getAllCourierEntries
);

// Get courier statistics
router.get(
  '/stats',
  auth(USER_ROLE.user),
  CourierController.getCourierStats
);

// Get a single courier entry by ID
router.get(
  '/:id',
  auth(USER_ROLE.user),
  CourierController.getCourierEntryById
);

// Update a courier entry
router.patch(
  '/:id',
  auth(USER_ROLE.user),
  validateRequest(CourierValidation.updateCourierEntryValidationSchema),
  CourierController.updateCourierEntry
);

// Delete a courier entry
router.delete(
  '/:id',
  auth(USER_ROLE.user),
  CourierController.deleteCourierEntry
);


// Bulk delete courier entries by IDs array
router.post(
  '/bulk-delete',
  auth(USER_ROLE.user),
  validateRequest(CourierValidation.bulkDeleteCourierEntriesValidationSchema),
  CourierController.deleteMultipleCourierEntries
);

// Clear all courier entries for the authenticated user
router.delete(
  '/clear-all',
  auth(USER_ROLE.user),
  CourierController.clearAllCourierEntries
);

export const CourierRoutes = router;
