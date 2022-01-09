import CommonException from './commonException';

export default class BadRequestException extends CommonException {
  constructor(message) {
    super(400, message);
  }
}
