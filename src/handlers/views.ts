import { RequestHandler } from 'express';
import User from '../models/user';
import Image from '../models/image';
import { asyncHandler, asyncHandlerRedirect } from '../utils/app-utils';

export const authCheck: RequestHandler = (req, res, next) =>
  req.user ? next() : res.redirect('/');

export const renderHome: RequestHandler = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user);
  const images = await Image.find({}).select('_id location').exec();

  res.render('home', { user, images });
});

export const renderLogin: RequestHandler = (req, res) => {
  res.render('login', { user: null });
};

export const renderProfile: RequestHandler = asyncHandlerRedirect(
  async (req, res) => {
    const userId = req.user;
    const user = await User.findById(userId);
    const images = await Image.find({ user: userId })
      .select('_id location')
      .exec();

    res.render('profile', { user, images });
  },
);

export const renderUpload: RequestHandler = asyncHandlerRedirect(
  async (req, res) => {
    const userId = req.user;
    const user = await User.findById(userId);

    res.render('upload', { user });
  },
);
