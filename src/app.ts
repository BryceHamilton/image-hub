import express from 'express';
import morgan from 'morgan';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import cors from 'cors';
require('dotenv').config();

import { catchAllErrors } from './utils/app-utils';

import authRoutes from './routes/auth-routes';
import imageRoutes from './routes/image-routes';

mongoose.connect(process.env.DB_URL || '', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => console.log('db connected'));

const app = express();

app.set('port', process.env.PORT || 4000);

app.use(morgan('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: ['http://localhost:3000'],
    credentials: true,
  }),
);

app.use('/', express.static(__dirname + '/../public'));

app.use('/auth', authRoutes);
app.use('/images', imageRoutes);

app.use(catchAllErrors);

export default app;
