/* eslint-disable consistent-return */
import { NextFunction, Response } from 'express';
import jwt from 'jsonwebtoken';
import { ICustomRequest } from '../types';

export default (req: ICustomRequest, res: Response, next: NextFunction) => {
  const { authorization } = req.headers;
  const { JWT_SECRET = 'dev-secret' } = process.env;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return res
      .status(401)
      .send({ message: 'Необходима авторизация' });
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return res
      .status(401)
      .send({ message: 'Необходима авторизация' });
  }

  req.user = payload as any;

  next();
};
