import AWS from 'aws-sdk';
import Busboy from 'busboy';
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
export const upload_images: RequestHandler = async (req, res) => {
  const { user, headers } = req;
  const uploads: IImage[] = [];
  const isPublic: boolean = req.path === '/public';

  const busboy = new Busboy({ headers });
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
          });
          console.log('File [' + filename + '] Saved', image);
          uploads.push(image);
        });
      },
    );

    busboy.on('finish', () => {
      res
        .status(201)
        .json({ Message: 'Image(s) successfully Uploaded', uploads });
    });
    req.pipe(busboy);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ Message: 'Image upload failed', error });
  }
  res.status(201).json({ Message: 'Image(s) successfully Uploaded', uploads });
};

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
    await Image.deleteOne({ _id: image._id, user });
    res.status(200).json({
      Message: 'Image Successfully Deleted',
      deleted: id,
    });
  }
});

export const delete_images: RequestHandler = asyncHandler(async (req, res) => {
  const { images } = req.body;
  try {
    const imageKeys: Record<'Key', string>[] = [];
    images.forEach(async (imageId: string) => {
      const image = await Image.findById(imageId).exec();
      if (!image) {
        throw `Image not found: ${imageId}`;
      }
      imageKeys.push({ Key: image?.key || '' });
    });
    console.log(imageKeys);

    const params = {
      Bucket: process.env.AWS_BUCKET_NAME || '',
      Delete: {
        Objects: imageKeys,
        Quiet: false,
      },
    };
    await s3.deleteObjects(params).promise();
    await Image.deleteMany({ _id: { $in: [images] } }).exec();

    res.status(200).json({
      Message: 'All Images Successfully Deleted',
      deleted: images,
    });
  } catch (error) {
    res.status(500).json({
      Message: 'Error deleting Images',
      error,
    });
  }
});
