import express from 'express';
import {
  authCheck,
  renderHome,
  renderLogin,
  renderProfile,
  renderUpload,
} from '../handlers/views';

const router = express.Router();

router.get('/', renderHome);
router.get('/login', renderLogin);
router.get('/profile', authCheck, renderProfile);
router.get('/upload', authCheck, renderUpload);

export default router;
