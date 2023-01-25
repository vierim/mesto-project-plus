import STATUS_CODE from '../utils/constants';
import { IHttpException } from '../types';

class NotFoundError implements IHttpException {
  statusCode: number;

  name: string;

  message: string;

  constructor(message: string) {
    this.message = message;
    this.name = 'Not Found error';
    this.statusCode = STATUS_CODE.NOT_FOUND;
  }
}

export default NotFoundError;
