import multer from 'multer'
import path from 'path'
import { BuildFormat } from '../common/response'

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, '/Users/nadwei/Docker Project/test-nutech/dist/uploads')
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`)
  }
})

const fileFilter = (req: Express.Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const fileTypes = /jpeg|jpg|png/;
  const extName = fileTypes.test(path.extname(file.originalname).toLowerCase())
  const mimeType = fileTypes.test(file.mimetype)

  if (extName && mimeType) {
    return cb(null, true)
  } else {
    return BuildFormat.failed(null, 'Format Image tidak sesuai')
  }
}

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter,
})

export default upload
