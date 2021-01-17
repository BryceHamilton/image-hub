import { Schema, Document, model } from 'mongoose';

export interface IImage extends Document {
  location: string;
  key: string;
  user: string;
  title: string;
  description: string;
  isPublic: boolean;
}

const ImageSchema = new Schema({
  location: String,
  key: String,
  title: String,
  description: String,
  isPublic: Boolean,
  user: { type: Schema.Types.ObjectId, ref: 'User' },
});

export default model<IImage>('Image', ImageSchema, 'Image');
