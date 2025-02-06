import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { BuildFormat } from '../common/response'
import dotenv from 'dotenv'
dotenv.config()

const secretKey = process.env.SECRET

export const authenticateJWT = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers['authorization']?.split(' ')[1]
  if (!token) {
    return BuildFormat.unautorize(res, 'Token tidak valid atau kadaluwarsa')
  }

  if (!secretKey) {
    return BuildFormat.unautorize(res, 'Token tidak valid atau kadaluwarsa')
  }

  jwt.verify(token, secretKey, (err: any, user: any) => {
    if (err !== null) {
      return BuildFormat.unautorize(res, 'Token tidak valid atau kadaluwarsa')
    }
    (req as any).user = user
    next();
  })
}