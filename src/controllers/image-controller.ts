import AWS from 'aws-sdk';
import { RequestHandler } from 'express';
import { asyncHandler } from '../utils/app-utils';
import Image, { IImage } from '../models/image';

require('dotenv').config();

const { AWS_KEY_ID, AWS_SECRET_KEY, AWS_REGION } = process.env;

const s3 = new AWS.S3({
  accessKeyId: AWS_KEY_ID,
  secretAccessKey: AWS_SECRET_KEY,
  region: AWS_REGION,
});

// [CREATE]
export const upload_images: RequestHandler = asyncHandler(async (req, res) => {
  const files: any = req.files;
  const uploads: IImage[] = [];
  const publicAccess: boolean = req.path === '/public';
  try {
    files.forEach(async (file: any) => {
      if (!file.mimetype.startsWith('image')) {
        throw 'Invalid file type';
      }
      const image: IImage = await Image.create({
        location: file.location,
        user: req.user,
        publicAccess,
      });
      uploads.push(image);
    });
    res
      .status(201)
      .json({ Message: 'Image(s) successfully Uploaded', uploads });
  } catch (error) {
    res.status(500).json({ Message: 'Image upload failed', error });
  }
});

// [READ]
export const get_image_list: RequestHandler = asyncHandler(async (_, res) => {
  const images = await Image.find({ publicAccess: true }).exec();
  res.status(200).json({ Message: 'All Images', images });
});

export const get_image_by_id: RequestHandler = asyncHandler(async (_, res) => {
  const params = {
    Bucket: process.env.AWS_BUCKET_NAME || '',
    Key: 'js.jpg',
  };
  const url = s3.getSignedUrl('getObject', params);
  res.status(200).json({ image: '*Image*', url });
});

// [DELETE]
export const delete_image: RequestHandler = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { user } = req;
  const image = await Image.find({ _id: id, user });
  if (image) await Image.deleteOne({ _id: id, user });
  res.redirect('/profile');
});
