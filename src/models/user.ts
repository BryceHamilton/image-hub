import { Schema, Document, model } from 'mongoose';

export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
}

const UserSchema = new Schema({
  username: String,
  email: String,
  password: String,
});

export default model<IUser>('User', UserSchema, 'User');
