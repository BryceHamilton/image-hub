import { RequestHandler } from 'express';
import User from '../models/user';

export const checkDuplicateUsernameOrEmail: RequestHandler = (
  req,
  res,
  next,
) => {
  const { username, email } = req.body;
  User.findOne({
    username,
  }).exec((err, user) => {
    if (err) return res.status(500).send({ Message: err });
    if (user)
      return res
        .status(400)
        .send({ Message: 'Failed! Username is already in use!' });

    User.findOne({
      email,
    }).exec((err, user) => {
      if (err) return res.status(500).send({ Message: err });
      if (user)
        return res
          .status(400)
          .send({ Message: 'Failed! Email is already in use!' });

      next();
    });
  });
};
