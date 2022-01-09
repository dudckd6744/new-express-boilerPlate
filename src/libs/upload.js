import multer from 'multer';
import multerS3 from 'multer-s3';
import { s3 } from '../config/s3';

export const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: 'wooyc/RoYal',
    acl: 'public-read',
    contentType: multerS3.AUTO_CONTENT_TYPE,
    cacheControl: 'max-age=31536000',
    metadata: (req, file, cb) => {
      cb(null, { fieldName: file.fieldname });
    },
    key: (req, file, cb) => {
      cb(null, `${Date.now()}_${file.originalname}`);
    },
  }),
});
