import { RequestHandler } from 'express';
import { CallbackError } from 'mongoose';
import User, { IUser } from '../models/user';
import Image, { IImage } from '../models/image';
import { asyncHandler, asyncHandlerRedirect } from '../utils/app-utils';

export const authCheck: RequestHandler = (req, res, next) =>
  req.user ? next() : res.redirect('/');

export const renderHome: RequestHandler = (req, res) => {
  req.user ? res.redirect('/profile') : res.render('home', { user: null });
};

export const renderProfile: RequestHandler = asyncHandlerRedirect(
  async (req, res) => {
    const userId = req.user;
    const user = await User.findById(userId);
    const images = await Image.find({ user: userId }).select('location').exec();

    res.render('profile', { user, images });
  },
);

export const renderUpload: RequestHandler = (req, res) => {
  const userId = req.user;
  User.findById(userId, (err: CallbackError, user: IUser | null) => {
    err ? res.redirect('/') : res.render('upload', { user });
  });
};
