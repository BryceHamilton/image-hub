import { RequestHandler } from 'express';
import jwt from 'jsonwebtoken';
require('dotenv').config();

const { JWT_SECRET } = process.env;

export const verifyToken: RequestHandler = (req: any, res, next) => {
  const token = <string>req.headers.authorization.split(' ')[1];

  if (!token) return res.status(403).send({ Message: 'No token provided!' });

  jwt.verify(token, JWT_SECRET || '', (err, decoded: any) => {
    if (err) return res.status(401).send({ Message: 'Unauthorized!' });
    req.user = decoded?.id;
    next();
  });
};
