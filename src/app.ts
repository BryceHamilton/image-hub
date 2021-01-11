import express from 'express';
import morgan from 'morgan';
import mongoose from 'mongoose';
import cors from 'cors';
import cookieSession from 'cookie-session';
import { cookieParams } from './services/passport-setup';
require('./services/passport-setup');
require('dotenv').config();

import { catchAllErrors } from './utils/app-utils';

import viewRoutes from './routes/views';
import authRoutes from './routes/auth';
import imageRoutes from './routes/images';
import passport from 'passport';

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

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.use(cors());
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieSession(cookieParams));
app.use(passport.initialize());
app.use(passport.session());

app.use(express.static(__dirname + '/public'));

app.use('/auth', authRoutes);
app.use('/', viewRoutes);
app.use('/images', imageRoutes);

// app.use(catchAllErrors);

export default app;
