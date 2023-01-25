import { Request } from 'express';

export interface ICustomRequest extends Request {
  user?: {
    _id: string;
  }
}

export interface IHttpException extends Error {
  statusCode: number;
}

export interface ITokenData {
  _id: string;
}
