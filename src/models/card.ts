import mongoose, { Schema } from "mongoose";
import { urlValidation } from '../utils/validation';

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
    minlength: 2,
    maxlength: 30,
  },
  link: {
    type: String,
    required: true,
    validate: {
      validator: urlValidation,
      message: "Неправильный формат ссылки на изображение",
    },
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  likes: [
    {
      type: Schema.Types.ObjectId,
      // Не пониманию, надо ли тут добавлять параметр ref.
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model<ICard>("card", cardSchema);
