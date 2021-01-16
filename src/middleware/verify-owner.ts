import { RequestHandler } from 'express';
import { CallbackError } from 'mongoose';
import { IUser } from '../models/user';

const User = require('../models/user');

export const verifyOwner: RequestHandler = (req, res, next) => {
  User.findById(req.user, (err: CallbackError, user: IUser) => {
    if (err)
      return res.status(500).json({
        Message: 'User search failed',
      });
    if (!user) return res.status(404).json({ Message: 'User not Authorized' });

    next();
  });
};
