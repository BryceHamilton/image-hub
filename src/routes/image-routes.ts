import AWS from 'aws-sdk';
import express from 'express';

const router = express.Router();

const { AWS_KEY_ID, AWS_SECRET_KEY, AWS_REGION, AWS_BUCKET_NAME } = process.env;

const s3 = new AWS.S3({
  accessKeyId: AWS_KEY_ID,
  secretAccessKey: AWS_SECRET_KEY,
  region: AWS_REGION,
});

import {
  get_image_list,
  upload_images,
  get_image_by_id,
  delete_image,
} from '../controllers/image-controller';
import { verifyToken, verifyOwner } from '../middleware';

router.get('/', get_image_list);
router.post('/', [verifyToken], upload_images);
router.post('/public', [verifyToken], upload_images);

router.get('/:id', get_image_by_id);
router.delete('/:id', [verifyToken, verifyOwner], delete_image);

export default router;
