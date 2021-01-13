import { Schema, Document, model } from 'mongoose';

export interface IImage extends Document {
  location: string;
  user: string;
}

const ImageSchema = new Schema({
  location: String,
  user: { type: Schema.Types.ObjectId, ref: 'User' },
});

export default model<IImage>('Image', ImageSchema, 'Image');
