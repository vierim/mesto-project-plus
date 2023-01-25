import { NextFunction, Response } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/user';

import { ICustomRequest, ITokenData } from '../types';

import { AuthError, NotFoundError } from '../errors';

export default async (req: ICustomRequest, _res: Response, next: NextFunction) => {
  const { authorization } = req.headers;
  const { JWT_SECRET = 'dev-secret' } = process.env;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return next(new AuthError('Ошибка авторизации'));
  }

  let payload;
  const token = authorization.replace('Bearer ', '');

  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return next(new AuthError('Ошибка авторизации'));
  }

  req.user = payload as ITokenData;

  try {
    await User.findById(req.user._id)
      .orFail(new NotFoundError('Пользователь не найден'));
  } catch (error) {
    return next(error);
  }

  return next();
};
