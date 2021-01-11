import { Schema, Document, model } from 'mongoose';

export interface IUser extends Document {
  username: string;
  googleId: string;
}

const UserSchema = new Schema({
  username: String,
  googleId: String,
});

export default model<IUser>('User', UserSchema, 'User');
