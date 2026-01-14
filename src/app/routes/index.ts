import { Router } from 'express';
import { AuthRoutes } from '../modules/Auth/auth.route';
import { UserRoutes } from '../modules/User/user.route';
import { CourierRoutes } from '../modules/Courier/courier.route';
import { APIConfigRoutes } from '../modules/APIConfig/apiConfig.route';
import { FraudRoutes } from '../modules/Fraud/fraud.route';
import { CustomAIRoutes } from '../modules/CustomAI/customAI.route';
import { DuplicatePhoneCheckRoutes } from '../modules/DuplicatePhoneCheck/duplicatePhoneCheck.route';

const router = Router();

const moduleRoutes = [
  {
    path: '/auth',
    route: AuthRoutes,
  },
  {
    path: '/users',
    route: UserRoutes,
  },
  {
    path: '/courier',
    route: CourierRoutes,
  },
  {
    path: '/api-config',
    route: APIConfigRoutes,
  },
  {
    path: '/custom-ai',
    route: CustomAIRoutes,
  },
  {
    path: '/fraud',
    route: FraudRoutes,
  },
  {
    path: '/duplicate-phone-check',
    route: DuplicatePhoneCheckRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
