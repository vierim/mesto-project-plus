import mongoose from 'mongoose';
import validator from 'validator';

import { urlValidation } from '../utils/helpers';

interface IUser {
  name: string;
  about: string;
  avatar: string;
  email: string;
  password: string;
}

const userSchema = new mongoose.Schema<IUser>({
  name: {
    type: String,
    required: true,
    minlength: [2, 'Имя пользователя должно содержать не менее 2 символов'],
    maxlength: [30, 'Имя пользователя должно содержать не более 30 символов'],
    default: 'Жак-Ив Кусто',
  },
  about: {
    type: String,
    required: true,
    minlength: [2, 'Описание должно содержать не менее 2 символов'],
    maxlength: [200, 'Описание должно содержать не более 200 символов'],
    default: 'Исследователь',
  },
  avatar: {
    type: String,
    required: true,
    validate: {
      validator: urlValidation,
      message: 'Неправильный формат ссылки на изображение',
    },
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
  },
  email: {
    type: String,
    required: [true, 'Пропущено обязательное поле - электронная почта'],
    unique: true,
    validate: {
      validator: (value: string) => validator.isEmail(value),
      message: 'Неправильный формат электронной почты',
    },
  },
  password: {
    type: String,
    required: [true, 'Пропущено обязательное поле - пароль'],
    select: false,
  },
});

export default mongoose.model<IUser>('user', userSchema);
