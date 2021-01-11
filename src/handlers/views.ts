import { RequestHandler } from 'express';
import { CallbackError } from 'mongoose';
import User, { IUser } from '../models/user';

export const authCheck: RequestHandler = (req, res, next) =>
  req.user ? next() : res.redirect('/');

export const renderHome: RequestHandler = (req, res) => {
  req.user ? res.redirect('/profile') : res.render('home');
};

export const renderProfile: RequestHandler = (req, res, next) => {
  const userId = req.user;
  User.findById(userId, (err: CallbackError, user: IUser | null) => {
    err ? next(err) : res.render('profile', { user });
  });
};

export const renderUpload: RequestHandler = (req, res) => res.render('upload');
