import InvalidAuthorizedTokenError from '../exceptions/invalidAuthorizedTokenException';
import { redisClient } from '../libs/database';
import { verify, sign, refreshTokenSign, refreshVerify } from '../libs/jwt.js';
const bypassPathList = ['/login', '/', '/api/user'];

export const verifyJWT = async (req, res, next) => {
  const bearerToken = req.headers['x-access-token'];
  const refreshBearerToken = req.headers['cookie'] || '';
  try {
    if (bearerToken) {
      const token = bearerToken.replace(/^Bearer /, '');
      const refreshCookie = refreshBearerToken.replace("refresh-token=",'')
      // NOTE: verify 시 복호화 값 or jwt expired 값만 return 되게 만들었습니다.
      const user = verify(token);
      const refreshToken = refreshVerify(refreshCookie);

      // NOTE: AccessToken 만료 && RefreshToken 유효할때
      if (user == 'jwt expired' && refreshToken) {
        if (refreshToken != 'jwt expired') {
          const UUID = await redisClient.get(refreshCookie);
          const token = signing(UUID);
          req.token = token
          return next();
          // NOTE: AccessToken 만료 && RefreshToken 만료
        } else {
          next(new InvalidAuthorizedTokenError(user || 'Invalid Bearer Token'));
        }
        // NOTE: AccessToken 유효 && RefreshToken 만료
      } else {
        const refreshExpire = await redisClient.KEYS(user.UUID);
        if (user.UUID && !refreshExpire[0]) {
          const NewRefreshToken = reFreshsigning();
          const time = 60 * 60 * 24 * 14;
          redisClient.set(NewRefreshToken, user.UUID);
          redisClient.set(user.UUID, '');
          redisClient.expire(NewRefreshToken, time);
          redisClient.expire(user.UUID, time);
          // NOTE: 배포시에 secure && httpOnly 적용
          res.cookie('refresh-token', NewRefreshToken);
        }
      }
      req.user = user;
    } else {
      const { path } = req;
      const found = bypassPathList.find((p) => p === path);
      if (!found) {
        throw new Error();
      }
    }
    next();
  } catch (err) {
    next(
      new InvalidAuthorizedTokenError(err.message || 'Invalid Bearer Token'),
    );
  }
};
export const signing = (UUID) => sign({ UUID });
export const reFreshsigning = () => refreshTokenSign({});
