import { Schema, Document, model } from 'mongoose';

export interface IImage extends Document {
  location: string;
  key: string;
  user: string;
  isPublic: boolean;
}

const ImageSchema = new Schema({
  location: String,
  key: String,
  isPublic: Boolean,
  user: { type: Schema.Types.ObjectId, ref: 'User' },
});

export default model<IImage>('Image', ImageSchema, 'Image');
