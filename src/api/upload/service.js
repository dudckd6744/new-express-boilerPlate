import BadRequestException from '../../exceptions/badRequestException';
import { upload } from '../../libs/upload';

export default class UploadService {
  uploadFile(req, res) {
    const file = req.file;
    return {
      file_image: file.location,
      file_key: file.key,
    };
  }
}
