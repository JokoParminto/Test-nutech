import { Request, Response } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import knex from '../db'
import { BuildFormat } from '../common/response'
import dotenv from 'dotenv'
dotenv.config()
import path from 'path';


export const getProfile = async (req: Request, res: Response) => {
  const userId: number = (req as any).user.id
  try {
    const result = await knex.raw(
      'SELECT email, first_name, last_name, profile_image FROM users WHERE id = ? LIMIT 1', [userId]
    )
    console.log(result)
    if (result.rowCount === 0) {
      return BuildFormat.notFound(res, 'Username atau password salah')
    }

    return BuildFormat.success(res, 'Sukses', result.rows[0])
  } catch (err) {
    return BuildFormat.unautorize(res, 'Token tidak valid atau kadaluwarsa')
  }
}

export const createUser = async (req: Request, res: Response) => {
  const { email, first_name, last_name, password } = req.body
  const hashedPassword = await bcrypt.hash(password, 10)

  try {
    const create = await knex.raw(
      `INSERT INTO users (email, first_name, last_name, password) VALUES (?, ?, ?, ?) RETURNING *`,
      [email, first_name, last_name, hashedPassword]
    )
    console.log(create)
    if (create.rowCount !== 0) {
      return BuildFormat.succesCreate(res, 'Registrasi berhasil silakan login')
    }
  } catch (err) {
    return BuildFormat.error(res, 'Registrasi gagal')
  }
}

export const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body

  try {
    const result = await knex.raw(
      'SELECT * FROM users WHERE email = ? LIMIT 1', [email]
    )
    if (result.rowCount === 0) {
      return BuildFormat.notFound(res, 'Username atau password salah')
    }
    
    const user = result.rows[0]
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return BuildFormat.notFound(res, 'Username atau password salah')
    }

    const secretKey = process.env.SECRET
    if (!secretKey) {
      return BuildFormat.notFound(res, 'Secret key tidak ditemukan')
    }
    console.log(user)
    const token = jwt.sign({ 
      id: user.id, 
      first_name: user.first_name, 
      last_name: user.last_name, 
      email: user.email 
    }, secretKey, { expiresIn: '12h' })
    return BuildFormat.success(res, 'Login Sukses', token)
  } catch (err) {
    BuildFormat.notFound(res, 'Username atau password salah')
  }
}

export const updateProfile = async (req: Request, res: Response) => {
  const { first_name, last_name } = req.body
  const userId: number = (req as any).user.id

  try {
    const result = await knex.raw(
      'UPDATE users SET first_name = ?, last_name = ? WHERE id = ?',
      [first_name, last_name, userId]
    )
    console.log(result)
    if (result.rowCount !== 0) {
      const getProfile = await knex.raw(
        'SELECT email, first_name, last_name, profile_image FROM users WHERE id = ? LIMIT 1', [userId]
      )
      return BuildFormat.success(res, 'Update Pofile berhasil', getProfile.rows[0])
    }
  } catch (err) {
    return BuildFormat.unautorize(res, 'Token tidak valid atau kadaluwarsa')
  }
}

export const updateImage = async (req: Request, res: Response) => {
  const userId: number = (req as any).user.id
  if (!req.file) {
    return BuildFormat.failed(null, 'Format Image tidak sesuai')
  }
  const profile_image = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`
  
  try {
    const result = await knex.raw(
      'UPDATE users SET profile_image = ? WHERE id = ?',
      [profile_image, userId]
    )
    console.log(result)
    if (result.rowCount !== 0) {
      const getProfile = await knex.raw(
        'SELECT email, first_name, last_name, profile_image FROM users WHERE id = ? LIMIT 1', [userId]
      )
      return BuildFormat.success(res, 'Update Profile Image berhasil', getProfile.rows[0])
    }
  } catch (err) {
    return BuildFormat.failed(null, 'Format Image tidak sesuai')
  }
}

export const getFile = async(req: Request, res: Response) => {
  const fileName = req.params.filename;
  const filePath = path.join(__dirname, '../../uploads', fileName)
  console.log(filePath)
  res.sendFile(filePath, (err) => {
    if (err) {
      res.status(404).json({ message: 'File not found' })
    }
  })
}


