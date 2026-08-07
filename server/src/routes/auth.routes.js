import { Router } from 'express';
import { registrar, login } from '../controllers/auth.controller.js';
import { loginLimiter } from '../middleware/rateLimit.middleware.js';

const router = Router();

router.post('/registro', registrar);
router.post('/login', loginLimiter, login);

export default router;