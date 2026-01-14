import { Router } from 'express';
import { CustomAIController } from './customAI.controller';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../Auth/auth.utils';

const router = Router();

// Set or update custom AI prompt
router.post('/prompt', auth(USER_ROLE.user), CustomAIController.setCustomPrompt);

// Update only if prompt exists
router.put('/prompt', auth(USER_ROLE.user), CustomAIController.updateCustomPrompt);

// Get custom AI prompt
router.get('/prompt', auth(USER_ROLE.user), CustomAIController.getCustomPrompt);

// Delete custom AI prompt
router.delete('/prompt', auth(USER_ROLE.user), CustomAIController.deleteCustomPrompt);

export const CustomAIRoutes = router;
