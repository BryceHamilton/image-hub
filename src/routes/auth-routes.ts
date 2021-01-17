import express from 'express';
import {
  get_user,
  login,
  logout,
  signup,
} from '../controllers/auth-controller';
import { checkDuplicateUsernameOrEmail, verifyToken } from '../middleware';

const router = express.Router();

router.get('/', verifyToken, get_user);
router.post('/signup', checkDuplicateUsernameOrEmail, signup);
router.post('/login', login);
router.get('/logout', logout);

export default router;
