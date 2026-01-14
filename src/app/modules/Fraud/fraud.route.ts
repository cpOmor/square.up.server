import { Router } from 'express';
import { FraudController } from './fraud.controller';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../Auth/auth.utils';

const router = Router();


// Add fraud setting for user
router.post('/setting', auth(USER_ROLE.user), FraudController.addFraudSetting);

// Get fraud setting for user
router.get('/setting', auth(USER_ROLE.user), FraudController.getFraudSetting);

// Update fraud setting for user
router.patch('/setting', auth(USER_ROLE.user), FraudController.updateFraudSetting);


// Check fraud for a given risk score (full order data)
router.post('/check', auth(USER_ROLE.user), FraudController.checkFraud);

// Check fraud using only email or phone
router.post('/check/email-or-phone', auth(USER_ROLE.user), FraudController.checkFraudByEmailOrPhone);

export const FraudRoutes = router;
