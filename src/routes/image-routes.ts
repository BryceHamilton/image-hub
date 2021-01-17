import AWS from 'aws-sdk';
import express from 'express';
import multer from 'multer';
import multerS3 from 'multer-s3';

const router = express.Router();

const { AWS_KEY_ID, AWS_SECRET_KEY, AWS_REGION, AWS_BUCKET_NAME } = process.env;

const s3 = new AWS.S3({
  accessKeyId: AWS_KEY_ID,
  secretAccessKey: AWS_SECRET_KEY,
  region: AWS_REGION,
});

const uploadPrivate = multer({
  storage: multerS3({
    s3: s3,
    bucket: AWS_BUCKET_NAME || '',
    key: (req, file, cb) => {
      cb(null, `${file.originalname}-${Date.now().toString()}`);
    },
  }),
});

const uploadPublic = multer({
  storage: multerS3({
    s3: s3,
    bucket: AWS_BUCKET_NAME || '',
    key: (req, file, cb) => {
      cb(null, `${file.originalname}-${Date.now().toString()}`);
    },
    acl: 'public-read',
  }),
});

import {
  get_image_list,
  upload_images,
  get_image_by_id,
  delete_image,
} from '../controllers/image-controller';
import { verifyToken, verifyOwner } from '../middleware';

router.get('/', get_image_list);
router.post('/', [uploadPrivate.array('images'), verifyToken], upload_images);
router.post(
  '/public',
  [uploadPublic.array('images'), verifyToken],
  upload_images,
);

router.get('/:id', get_image_by_id);
router.get('/delete/:id', [verifyToken, verifyOwner], delete_image);

export default router;
