import express from 'express';
import multer from 'multer';

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const router = express.Router();

import {
  get_image_list,
  upload_image,
  get_image_by_id,
  replace_image,
  modify_image,
  delete_image,
} from '../controllers/images-controller';
import { verifyToken, verifyOwner } from '../middleware';

router.get('/', get_image_list);
router.post(
  '/',
  [upload.single('file'), verifyToken, verifyOwner],
  upload_image,
);

router.get('/:id', get_image_by_id);
router.get('/delete/:id', [verifyToken, verifyOwner], delete_image);

router.put('/:id', replace_image);
router.patch('/:id', modify_image);

export default router;
