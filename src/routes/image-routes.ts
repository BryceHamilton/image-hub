import express from 'express';

const router = express.Router();

import {
  get_image_list,
  upload_images,
  get_image_by_id,
  get_user_public_images,
  get_user_private_images,
  delete_image,
} from '../controllers/image-controller';
import { verifyToken, verifyOwner } from '../middleware';

// [CREATE]
router.post('/', verifyToken, upload_images);
router.post('/public', verifyToken, upload_images);

// [READ]
router.get('/', get_image_list);
router.get('/public/user', verifyToken, get_user_public_images);
router.get('/user', verifyToken, get_user_private_images);

router.get('/:id', get_image_by_id);

// [DELETE]
router.delete('/:id', [verifyToken, verifyOwner], delete_image);

export default router;
