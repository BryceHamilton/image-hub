import express from 'express';
import {
  authCheck,
  renderHome,
  renderProfile,
  renderUpload,
} from '../handlers/views';

const router = express.Router();

router.get('/', renderHome);
router.get('/profile', authCheck, renderProfile);
router.get('/upload', authCheck, renderUpload);

export default router;
