import bcrypt from 'bcryptjs';
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

import { ICustomRequest } from '../types';

import User from '../models/user';
import STATUS_CODE from '../utils/constants';

import {
  NotFoundError,
  AuthError,
} from '../errors';

export const getUsers = async (
  _req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const users = await User.find({});

    return res.status(STATUS_CODE.OK).send(users);
  } catch (error) {
    return next(error);
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { email, password } = req.body;
  const { JWT_SECRET = 'dev-secret' } = process.env;

  try {
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      throw new AuthError('Необходима авторизация');
    }

    const isMatched = await bcrypt.compare(password, user.password);
    if (!isMatched) {
      throw new AuthError('Необходима авторизация');
    }

    return res.send({
      token: jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: '7d' }),
    });
  } catch (error) {
    return next(error);
  }
};

export const createUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
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
    return next(error);
  }
};

export const getUserById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId)
      .orFail(new NotFoundError('Пользователь не найден'));

    return res.status(STATUS_CODE.OK).send(user);
  } catch (error) {
    return next(error);
  }
};

export const getCurrentUser = async (
  req: ICustomRequest,
  res: Response,
  next: NextFunction,
) => {
  const userId = req.user?._id;

  try {
    const user = await User.findById(userId)
      .orFail(new NotFoundError('Пользователь не найден'));

    return res.status(STATUS_CODE.OK).send(user);
  } catch (error) {
    return next(error);
  }
};

export const updateProfile = async (
  req: ICustomRequest,
  res: Response,
  next: NextFunction,
) => {
  const { name, about } = req.body;
  const userId = req.user?._id;

  try {
    const user = await User.findByIdAndUpdate(
      userId,
      { name, about },
      { new: true },
    ).orFail(new NotFoundError('Пользователь не найден'));

    return res.status(STATUS_CODE.OK).send(user);
  } catch (error) {
    return next(error);
  }
};

export const updateAvatar = async (
  req: ICustomRequest,
  res: Response,
  next: NextFunction,
) => {
  const { avatar } = req.body;
  const userId = req.user?._id;

  try {
    const user = await User.findByIdAndUpdate(
      userId,
      { avatar },
      { new: true },
    ).orFail(new NotFoundError('Пользователь не найден'));

    return res.status(STATUS_CODE.OK).send(user);
  } catch (error) {
    return next(error);
  }
};
