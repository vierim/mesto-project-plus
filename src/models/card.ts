import mongoose, { Schema } from 'mongoose';
import urlValidation from '../utils/validation';

interface ICard {
  name: string;
  link: string;
  owner: Schema.Types.ObjectId;
  likes: Schema.Types.ObjectId[];
  createdAt: Date;
}

const cardSchema = new mongoose.Schema<ICard>({
  name: {
    type: String,
    required: true,
    minlength: [2, 'Название изображения должно содержать не менее 2 символов'],
    maxlength: [30, 'Название изображения должно содержать не более 30 символов'],
  },
  link: {
    type: String,
    required: [true, 'Пропущено обязательное поле - ссылка на изображение'],
    validate: {
      validator: urlValidation,
      message: 'Неправильный формат ссылки на изображение',
    },
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  likes: [
    {
      type: Schema.Types.ObjectId,
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model<ICard>('card', cardSchema);
