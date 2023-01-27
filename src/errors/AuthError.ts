import STATUS_CODE from '../utils/constants';
import { IHttpException } from '../types';

class AuthError implements IHttpException {
  statusCode: number;

  name: string;

  message: string;

  constructor(message: string) {
    this.message = message;
    this.name = 'Authorization error';
    this.statusCode = STATUS_CODE.AUTH_ERROR;
  }
}

export default AuthError;
