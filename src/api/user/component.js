import { Router } from 'express';
import successWrapper from '../../libs/success';
import BadRequestException from '../../exceptions/badRequestException';
import { reFreshsigning, signing } from '../../middlewares/auth';

import UserService from './service';
import Dao from './dao';
import { close, redisClient } from '../../libs/database';

export default class UserComponent {
  router = Router();
  service = new UserService(new Dao());

  getService() {
    return this.service;
  }

  constructor() {
    this.initializeRouter();
  }
  initializeRouter() {
    const router = Router();
    const path = '/user';
    router
      .post('/', successWrapper(this.signUp))
      .get('/me', successWrapper(this.me))
      .post('/access', successWrapper(this.refreshToken));
    this.router.use(path, router);
  }
  signUp = (req, res) => {
    const { phone } = req.body;
    if (!phone) {
      throw new BadRequestException('전화번호를 알려주세요');
    }
    let user = this.getService().findUserByPhone(phone);
    if (!user) {
      this.getService().insertUser(phone);
      user = this.getService().findUserByPhone(phone);
    }
    let token = signing(user.UUID);
    let refreshToken = reFreshsigning();

    redisClient.set(refreshToken, user.UUID);
    redisClient.set(user.UUID, '');
    // NOTE: 2주 입니다
    const time = 60 * 60 * 24 * 14;
    redisClient.expire(refreshToken, time);
    redisClient.expire(user.UUID, time);

    return { token, refreshToken };
  };

  me = (req, res) => {
    const { UUID } = req.user;
    let user = this.getService().findUserByUUID(UUID);
    return user;
  };

  refreshToken=(req,res)=> {
    const token = req.token

    return {token}
  }
}
