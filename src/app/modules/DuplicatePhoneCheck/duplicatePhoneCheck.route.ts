import { Router } from 'express';
import { DuplicatePhoneCheckController } from './duplicatePhoneCheck.controller';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../Auth/auth.utils';

const router = Router();

// Create duplicate phone check setting for user
router.post('/setting', auth(USER_ROLE.user), DuplicatePhoneCheckController.createDuplicatePhoneCheckSetting);

// Get duplicate phone check setting for user
router.get('/setting', auth(USER_ROLE.user), DuplicatePhoneCheckController.getDuplicatePhoneCheckSetting);

// Update duplicate phone check setting for user
router.patch('/setting', auth(USER_ROLE.user), DuplicatePhoneCheckController.updateDuplicatePhoneCheckSetting);

export const DuplicatePhoneCheckRoutes = router;
