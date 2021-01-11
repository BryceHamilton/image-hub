import express from 'express';
import passport from 'passport';
import { redirectToProfile, logout } from '../handlers/auth';

const router = express.Router();

router.get('/logout', logout);
router.get('/google', passport.authenticate('google', { scope: ['profile'] }));
router.get(
  '/google/redirect',
  passport.authenticate('google'),
  redirectToProfile,
);

export default router;
