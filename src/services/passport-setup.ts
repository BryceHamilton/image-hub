require('dotenv').config();
import { CallbackError } from 'mongoose';
import { Profile } from 'passport';
import { VerifyCallback } from 'passport-google-oauth20';
import User, { IUser } from '../models/user';
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20');
const { Profile } = GoogleStrategy;

const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } = process.env;
const GOOGLE_REDIRECT = '/auth/google/redirect';

passport.serializeUser((user: IUser, done: VerifyCallback) => {
  done(undefined, user.id);
});
passport.deserializeUser((id: string, done: VerifyCallback) => {
  User.findById(id, (err: CallbackError, user: IUser | null) =>
    err ? console.error(err) : done(undefined, user?.id),
  );
});

const asyncHandler = (fn: GoogleCallback): GoogleCallback => (
  accessToken,
  refreshToken,
  profile,
  done,
): Promise<void> =>
  Promise.resolve(fn(accessToken, refreshToken, profile, done)).catch(
    console.error,
  );

const googleParams = {
  callbackURL: GOOGLE_REDIRECT,
  clientID: GOOGLE_CLIENT_ID,
  clientSecret: GOOGLE_CLIENT_SECRET,
};

const googleCallback: GoogleCallback = asyncHandler(
  async (
    accessToken: string,
    refreshToke: string,
    profile: typeof Profile,
    done: any,
  ) => {
    const user = await User.findOne({ googleId: profile.id });
    if (user) return done(null, user);

    const newUser = await User.create({
      username: profile.displayName,
      googleId: profile.id,
    });

    return done(null, newUser);
  },
);

passport.use(new GoogleStrategy(googleParams, googleCallback));

type GoogleCallback = (
  accessToken: string,
  refreshToken: string,
  profile: Profile,
  done: VerifyCallback,
) => void;

const DAY_IN_MILLISECONDS = 24 * 60 * 60 * 1000;

export const cookieParams = {
  maxAge: DAY_IN_MILLISECONDS,
  keys: [process.env.COOKIE_KEY || 'ZG3G7YN53ML4YLAAWQVDJVA'],
};
