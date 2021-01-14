import AWS from 'aws-sdk';
import { RequestHandler } from 'express';
import { asyncHandler } from '../utils/app-utils';
import Image from '../models/image';
require('dotenv').config();

const { AWS_KEY_ID, AWS_SECRET_KEY, AWS_REGION } = process.env;

const s3 = new AWS.S3({
  accessKeyId: AWS_KEY_ID,
  secretAccessKey: AWS_SECRET_KEY,
  region: AWS_REGION,
});

// [CREATE]
export const upload_image: RequestHandler = asyncHandler(async (req, res) => {
  const { file } = req;
  const params = {
    Bucket: process.env.AWS_BUCKET_NAME || '',
    Key: file.originalname,
    Body: file.buffer,
    ContentType: file.mimetype,
    ACL: 'public-read',
  };

  const data = await s3.upload(params).promise();
  const image = await Image.create({
    location: data.Location,
    user: req.user,
  });
  res
    .status(201)
    .json({ Message: 'Image Successfully Created', image: image.location });
});

// [READ]
export const get_image_list: RequestHandler = asyncHandler(async (_, res) => {
  console.log('image list');
  res.status(200).json({ images: 'All Images' });
});

export const get_image_by_id: RequestHandler = asyncHandler(async (_, res) => {
  const params = {
    Bucket: process.env.AWS_BUCKET_NAME || '',
    Key: 'js.jpg',
  };
  const url = s3.getSignedUrl('getObject', params);
  res.status(200).json({ image: '*Image*', url });
});

// [UPDATE]
export const replace_image: RequestHandler = (req, res) => {
  res.status(202).json({
    Message: 'Image Successfully Replaced',
    image: '*Image Replaced*',
  });
};

export const modify_image: RequestHandler = (req, res) => {
  res.status(202).json({
    Message: 'Image Successfully Modified',
    image: '*Image Modified*',
  });
};

// [DELETE]
export const delete_image: RequestHandler = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { user } = req;
  const image = await Image.find({ _id: id, user });
  if (image) await Image.deleteOne({ _id: id, user });
  res.redirect('/profile');
});
