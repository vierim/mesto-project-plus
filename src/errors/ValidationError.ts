import STATUS_CODE from '../utils/constants';
import { IHttpException } from '../types';

class ValidationError implements IHttpException {
  statusCode: number;

  name: string;

  message: string;

  constructor(message: string) {
    this.message = message;
    this.name = 'Bad request';
    this.statusCode = STATUS_CODE.BAD_REQUEST;
  }
}

export default ValidationError;
