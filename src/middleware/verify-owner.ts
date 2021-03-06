import { RequestHandler } from 'express';
import { CallbackError } from 'mongoose';
import Image, { IImage } from '../models/image';

export const verifyOwner: RequestHandler = (req: any, res, next) => {
  Image.findOne(
    { user: req.user, _id: req.params.id },
    (err: CallbackError, image: IImage) => {
      if (err)
        return res.status(500).json({
          Message: 'User search failed',
        });
      if (!image)
        return res.status(404).json({ Message: 'User not Authorized' });

      next();
    },
  );
};

export const verifyOwnerAll: RequestHandler = (req: any, res, next) => {
  const { images } = req.body;
  const { user } = req;
  images.forEach((_id: string) => {
    Image.findOne({ user, _id }, (err: CallbackError, image: IImage) => {
      if (err)
        return res.status(500).json({
          Message: 'User search failed',
        });
      if (!image)
        return res.status(404).json({ Message: 'User not Authorized' });
    });

    next();
  });
};
