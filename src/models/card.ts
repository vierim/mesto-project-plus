import mongoose from 'mongoose';

import { urlValidation } from '../utils/helpers';

interface ICard {
  name: string;
  link: string;
  owner: mongoose.Schema.Types.ObjectId;
  likes: mongoose.Schema.Types.ObjectId[];
  createdAt: Date;
}

const cardSchema = new mongoose.Schema<ICard>({
  name: {
    type: String,
    required: [true, 'Пропущено обязательное поле - название изображения'],
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
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: [true, 'Пропущено обязательное поле - id владельца изображения'],
  },
  likes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      default: [],
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
    required: true,
  },
});

export default mongoose.model<ICard>('card', cardSchema);
