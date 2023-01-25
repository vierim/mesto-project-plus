import STATUS_CODE from '../utils/constants';
import { IHttpException } from '../types';

class ForbiddenError implements IHttpException {
  statusCode: number;

  name: string;

  message: string;

  constructor(message: string) {
    this.message = message;
    this.name = 'Access forbidden';
    this.statusCode = STATUS_CODE.FORBIDDEN_ERROR;
  }
}

export default ForbiddenError;
