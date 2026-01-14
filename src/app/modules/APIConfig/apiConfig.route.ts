import { Router } from 'express';
import { APIConfigController } from './apiConfig.controller';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../Auth/auth.utils';

const router = Router();

// Create API config
router.post('/', auth(USER_ROLE.user), APIConfigController.createAPIConfig);

// Get all API configs (optionally filtered)
router.get('/', auth(USER_ROLE.user), APIConfigController.getAPIConfigs);

// Get single API config by ID
router.get('/:id', auth(USER_ROLE.user), APIConfigController.getAPIConfigById);

// Update API config by ID
router.patch('/:id', auth(USER_ROLE.user), APIConfigController.updateAPIConfig);

// Delete API config by ID
router.delete('/:id', auth(USER_ROLE.user), APIConfigController.deleteAPIConfig);

export const APIConfigRoutes = router;
