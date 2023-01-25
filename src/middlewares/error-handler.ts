import { NextFunction, Request, Response } from 'express';
import { IHttpException } from '../types';

export default (err: IHttpException, _req: Request, res: Response, next: NextFunction) => {
  const {
    statusCode = 500,
    message = 'На сервере произошла ошибка',
  } = err;

  res.status(statusCode).send({ message });

  next();
};
