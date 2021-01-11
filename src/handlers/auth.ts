import { RequestHandler } from 'express';

export const redirectToProfile: RequestHandler = (_, res) =>
  res.redirect('/profile');

export const logout: RequestHandler = (req, res) => {
  req.logout();
  res.redirect('/');
};
