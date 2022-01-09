import { Router } from 'express';
import successWrapper from '../../libs/success';
import { upload } from '../../libs/upload';
import UploadService from './service';

export default class UploadComponent {
  router = Router();
  service = new UploadService();

  getService() {
    return this.service;
  }

  constructor() {
    this.initializeRouter();
  }
  initializeRouter() {
    const router = Router();
    const path = '/upload';
    router.post('/', upload.single('file'), successWrapper(this.uploadFile));
    this.router.use(path, router);
  }

  uploadFile = async (req, res) => {
    const { UUID } = req.user;
    const file = this.getService().uploadFile(req, res);

    return file;
  };
}
