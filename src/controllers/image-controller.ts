import AWS from 'aws-sdk';
import { RequestHandler } from 'express';
import { asyncHandler } from '../utils/app-utils';
import Image, { IImage } from '../models/image';
import Busboy from 'busboy';

require('dotenv').config();

const { AWS_KEY_ID, AWS_SECRET_KEY, AWS_REGION } = process.env;

const s3 = new AWS.S3({
  accessKeyId: AWS_KEY_ID,
  secretAccessKey: AWS_SECRET_KEY,
  region: AWS_REGION,
});

// [CREATE]
export const upload_images: RequestHandler = asyncHandler(async (req, res) => {
  const { user, headers } = req;
  const { title, description } = req.body;

  console.log({ title, description });
  const uploads: IImage[] = [];
  const isPublic: boolean = req.path === '/public';

  let busboy = new Busboy({ headers });
  try {
    busboy.on(
      'file',
      (_: any, file: any, filename: any, __: any, mimetype: any) => {
        if (!mimetype.startsWith('image')) {
          throw 'Invalid file type';
        }
        const chunks: any[] = [];
        const fname = filename.replace(/ /g, '_');
        const ftype = mimetype;
        file.on('data', (data: any) => {
          chunks.push(data);
        });
        file.on('end', async () => {
          const params = {
            Bucket: process.env.AWS_BUCKET_NAME || '',
            Key: `${Date.now().toString()}-${fname}`,
            Body: Buffer.concat(chunks),
            ACL: isPublic ? 'public-read' : '',
            ContentType: ftype,
          };
          const data = await s3.upload(params).promise();
          console.log('File [' + filename + '] Uploaded', data);
          const image: IImage = await Image.create({
            location: data.Location,
            key: data.Key,
            user,
            isPublic,
            title,
            description,
          });
          console.log('File [' + filename + '] Saved', image);
          uploads.push(image);
        });
      },
    );
  } catch (error) {
    res.status(500).json({ Message: 'Image upload failed', error });
  }

  busboy.on('finish', () => {
    res
      .status(201)
      .json({ Message: 'Image(s) successfully Uploaded', uploads });
  });

  req.pipe(busboy);
});

// [READ]
export const get_image_list: RequestHandler = asyncHandler(async (_, res) => {
  const images = await Image.find({ isPublic: true })
    .populate('user username')
    .exec();
  res.status(200).json({ Message: 'All Images', images });
});

export const get_user_public_images: RequestHandler = asyncHandler(
  async (req, res) => {
    const { user } = req;
    const images = await Image.find({ user, isPublic: true }).exec();
    res.status(200).json({ Message: 'User Public Images', images });
  },
);

export const get_user_private_images: RequestHandler = asyncHandler(
  async (req, res) => {
    const { user } = req;
    const images = await Image.find({ user, isPublic: false }).exec();
    const signedImages = images.map((image) => {
      const params = {
        Bucket: process.env.AWS_BUCKET_NAME || '',
        Key: image.key,
      };
      const signedUrl = s3.getSignedUrl('getObject', params);
      return { ...image, signedUrl };
    });
    res
      .status(200)
      .json({ Message: 'User Private Images', images: signedImages });
  },
);

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
  const image = await Image.findOne({ _id: id, user });
  if (image) {
    const params = {
      Bucket: process.env.AWS_BUCKET_NAME || '',
      Key: image.key,
    };
    await s3.deleteObject(params).promise();
    await Image.deleteOne({ _id: id, user });
    res.status(204).json({ Message: 'Image deleted' });
  }
});
