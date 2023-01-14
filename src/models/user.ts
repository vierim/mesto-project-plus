import mongoose from 'mongoose';
import urlValidation from '../utils/validation';

interface IUser {
  name: string;
  about: string;
  avatar: string;
}

const userSchema = new mongoose.Schema<IUser>({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  about: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 200,
  },
  avatar: {
    type: String,
    required: true,
    validate: {
      validator: urlValidation,
      message: 'Неправильный формат ссылки на изображение',
    },
  },
});

export default mongoose.model<IUser>('user', userSchema);
