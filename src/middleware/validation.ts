import { body, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';
import { BuildFormat } from '../common/response'

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
      BuildFormat.failed(res, errors.array())
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
      BuildFormat.failed(res, errors.array())
    }
    next()
  },
]
