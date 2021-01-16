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
    if (err) return res.status(500).send({ Message: err });

    res.status(201).json({
      Message: 'User succesfully created',
      user,
    });
  });
};

export const login: RequestHandler = (req, res) => {
  const { username, password } = req.body;
  const user = User.findOne({
    username,
  });

  user.exec((err: CallbackError, user: IUser | null) => {
    if (err) return res.status(500).send({ message: err });
    if (!user) return res.status(404).send({ message: 'User Not found.' });

    const passwordIsValid = bcrypt.compareSync(password, user.password);

    if (!passwordIsValid) {
      return res.status(401).send({
        accessToken: null,
        message: 'Invalid Password!',
      });
    }
    const { id } = user;
    const payload = { id };
    const token = jwt.sign(payload, process.env.JWT_SECRET || '', {
      expiresIn: 86400, // 24 hours
    });

    res.cookie('token', token, { httpOnly: true });
    res.status(200).send({ Message: 'User authenticated', username });
  });
};
