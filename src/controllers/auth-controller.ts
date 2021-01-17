import bcrypt from 'bcrypt';
import { RequestHandler } from 'express';
import User, { IUser } from '../models/user';
import jwt from 'jsonwebtoken';
import { CallbackError } from 'mongoose';
require('dotenv').config();

export const signup: RequestHandler = (req, res) => {
  const { username, email } = req.body;
  const password = bcrypt.hashSync(req.body.password, 10);
  const user = new User({
    username,
    email,
    password,
  });

  user.save((err: CallbackError, user: IUser) => {
    if (err) return res.status(500).json({ Message: err });

    const { id } = user;
    const payload = { id };
    const token = jwt.sign(payload, process.env.JWT_SECRET || '', {
      expiresIn: '1d', // 24 hours
    });

    res.cookie('token', token, { httpOnly: true });
    res
      .status(201)
      .json({ Message: 'User succesfully created', user: { username } });
  });
};

export const login: RequestHandler = (req, res) => {
  const { username, password } = req.body;
  const user = User.findOne({
    username,
  });

  user.exec((err: CallbackError, user: IUser | null) => {
    if (err) return res.status(500).json({ message: err });
    if (!user) return res.status(404).json({ message: 'User Not found.' });

    const passwordIsValid = bcrypt.compareSync(password, user.password);

    if (!passwordIsValid) {
      return res.status(401).json({
        accessToken: null,
        message: 'Invalid Password!',
      });
    }
    const { id } = user;
    const payload = { id };
    const token = jwt.sign(payload, process.env.JWT_SECRET || '', {
      expiresIn: '1d', // 24 hours
    });

    res.cookie('token', token, { httpOnly: true });
    res.status(200).json({ Message: 'User authenticated', user: { username } });
  });
};

export const get_user: RequestHandler = (req, res) => {
  const userId = req.user;
  const user = User.findById(userId);
  user.exec((err: CallbackError, user: IUser | null) => {
    if (err) return res.status(500).json({ Message: 'User search failed' });
    if (!user) return res.status(404).json({ message: 'User Not found' });

    // refresh token
    const { id, username } = user;
    const payload = { id };
    const token = jwt.sign(payload, process.env.JWT_SECRET || '', {
      expiresIn: '1d', // 24 hours
    });

    res.cookie('token', token, { httpOnly: true });
    res.status(200).json({ Message: 'User authenticated', user: { username } });
  });
};

export const logout: RequestHandler = (_, res) => {
  res.clearCookie('token');
  res.status(200).json({ Message: 'User logged out' });
};
