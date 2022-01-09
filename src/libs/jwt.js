import jwt from 'jsonwebtoken';
import { jwtSecret } from '../config/config';
import InvalidAuthorizedTokenError from '../exceptions/invalidAuthorizedTokenException';
export const verify = (token, option, next) => {
  try {
    return jwt.verify(token, jwtSecret, option);
  } catch (error) {
    const message = error.message;
    if (message == 'jwt expired') {
      return message;
    }
    throw new InvalidAuthorizedTokenError(message);
  }
};
export const refreshVerify = (token, option, next) => {
  try {
    return jwt.verify(token, jwtSecret, option);
  } catch (error) {
    const message = error.message;
    return message;
  }
};
export const sign = (payload, option) =>
  jwt.sign(payload, jwtSecret, {
    algorithm: 'HS256',
    expiresIn: '5m',
    ...option,
  });
export const refreshTokenSign = (option) =>
  jwt.sign({}, jwtSecret, {
    algorithm: 'HS256',
    expiresIn: '14d',
    ...option,
  });
