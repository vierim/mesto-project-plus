import bcrypt from 'bcryptjs';
import { Request, Response } from 'express';

import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import { ICustomRequest } from '../types';
import User from '../models/user';

import STATUS_CODE from '../utils/constants';

export const getUsers = async (_req: Request, res: Response) => {
  try {
    const users = await User.find({});

    return res.status(STATUS_CODE.OK).send(users);
  } catch {
    return res
      .status(STATUS_CODE.DEFAULT_ERROR)
      .send({ message: 'На сервере произошла ошибка' });
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const { JWT_SECRET = 'dev-secret' } = process.env;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      const error = new Error('Неправильная почта или пароль');
      error.name = 'AuthError';

      throw error;
    }

    const isMatched = await bcrypt.compare(password, user.password);

    if (!isMatched) {
      const error = new Error('Неправильная почта или пароль');
      error.name = 'AuthError';

      throw error;
    }

    return res.send({
      token: jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: '7d' }),
    });
  } catch (error) {
    if (error instanceof Error && error.name === 'AuthError') {
      return res
        .status(STATUS_CODE.AUTH_ERROR)
        .send({ message: 'Неправильная почта или пароль' });
    }

    return res
      .status(STATUS_CODE.DEFAULT_ERROR)
      .send({ message: 'На сервере произошла ошибка' });
  }
};

export const createUser = async (req: Request, res: Response) => {
  const {
    name,
    about,
    avatar,
    email,
    password,
  } = req.body;

  try {
    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    });

    return res.status(STATUS_CODE.OK).send(user);
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      return res.status(STATUS_CODE.BAD_REQUEST).send({
        message: 'Переданы некорректные данные при создании пользователя',
      });
    }

    return res
      .status(STATUS_CODE.DEFAULT_ERROR)
      .send({ message: 'На сервере произошла ошибка' });
  }
};

export const getUserById = async (req: Request, res: Response) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId);

    if (!user) {
      const error = new Error('Пользователь с таким id не найден');
      error.name = 'UserNotFound';

      throw error;
    }

    return res.status(STATUS_CODE.OK).send(user);
  } catch (error) {
    if (error instanceof Error && error.name === 'UserNotFound') {
      return res
        .status(STATUS_CODE.NOT_FOUND)
        .send({ message: 'Пользователь по указанному _id не найден' });
    }

    return res
      .status(STATUS_CODE.DEFAULT_ERROR)
      .send({ message: 'На сервере произошла ошибка' });
  }
};

export const updateProfile = async (req: ICustomRequest, res: Response) => {
  const { name, about } = req.body;
  const userId = req.user?._id;

  try {
    if (!userId) {
      throw new Error('User _id is undefined');
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { name, about },
      { new: true },
    );

    if (!user) {
      const error = new Error('Пользователь с таким id не найден');
      error.name = 'UserNotFound';

      throw error;
    }

    return res.status(STATUS_CODE.OK).send(user);
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      return res.status(STATUS_CODE.BAD_REQUEST).send({
        message: 'Переданы некорректные данные при обновлении профиля',
      });
    }

    if (error instanceof Error && error.name === 'UserNotFound') {
      return res
        .status(STATUS_CODE.NOT_FOUND)
        .send({ message: 'Пользователь по указанному _id не найден' });
    }

    return res
      .status(STATUS_CODE.DEFAULT_ERROR)
      .send({ message: 'На сервере произошла ошибка' });
  }
};

export const updateAvatar = async (req: ICustomRequest, res: Response) => {
  const { avatar } = req.body;
  const userId = req.user?._id;

  try {
    if (!userId) {
      throw new Error('User _id is undefined');
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { avatar },
      { new: true },
    );

    if (!user) {
      const error = new Error('Пользователь с таким id не найден');
      error.name = 'UserNotFound';

      throw error;
    }

    return res.status(STATUS_CODE.OK).send(user);
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      return res.status(STATUS_CODE.BAD_REQUEST).send({
        message: 'Переданы некорректные данные при обновлении профиля',
      });
    }

    if (error instanceof Error && error.name === 'UserNotFound') {
      return res
        .status(STATUS_CODE.NOT_FOUND)
        .send({ message: 'Пользователь по указанному _id не найден' });
    }

    return res
      .status(STATUS_CODE.DEFAULT_ERROR)
      .send({ message: 'На сервере произошла ошибка' });
  }
};
