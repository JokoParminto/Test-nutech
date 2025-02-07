import { body, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';
import { BuildFormat } from '../common/response'
import knex from '../db'

export const validateUserRegistration = [
  body('email')
    .isEmail()
    .withMessage('Paramter email tidak sesuai format'),
  body('first_name')
    .isLength({ min: 3 })
    .withMessage('Username must be at least 3 characters long'),
  body('last_name')
    .isLength({ min: 3 })
    .withMessage('Username must be at least 3 characters long'),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password length minimal 8 karakter'),

  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return BuildFormat.failed(res, errors.array())
    }
    next()
  }
]

export const validationLogin = [
  body('email')
    .isEmail()
    .withMessage('Paramter email tidak sesuai format'),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password length minimal 8 karakter'),

  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return BuildFormat.failed(res, errors.array())
    }
    next()
  }
]

export const validationTopup = [
  body("top_up_amount")
    .isNumeric()
    .withMessage("Parameter amount hanya boleh angka")
    .custom((value) => {
      if (value < 0) {
        throw new Error("Parameter amount tidak boleh lebih kecil dari 0");
      }
      return true
    }),

  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return BuildFormat.failed(res, errors.array())
    }
    next()
  }
]

export const validationTransaction = [
  body("service_code")
    .isString()
    .withMessage("Parameter kode hanya boleh huruf")
    .custom(async (value) => {
      const service = await getServiceByCode(value)
      if (!service) {
        throw new Error("Service atau Layanan tidak ditemukan")
      }
      return true
    }),

  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return BuildFormat.failed(res, errors.array())
    }
    next()
  }
]

const getServiceByCode = async (code: string) => {
  const result = await knex.raw(
    "SELECT id FROM services WHERE service_code = ? LIMIT 1",
    [code]
  )

  return result.rows.length > 0 ? result.rows[0] : null
}