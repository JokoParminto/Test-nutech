import { Request, Response } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { BuildFormat } from '../common/response'
import dotenv from 'dotenv'
dotenv.config()
import path from 'path';
import { create, getByEmail, getById, updateData, updateImageProfile } from '../repository/userRepository'
import { createDefault } from '../repository/balanceRepository'


export const getProfile = async (req: Request, res: Response) => {
  const userId: number = (req as any).user.id
  try {
    const result = await getById(res, userId)
    if (result.rowCount === 0) {
      return BuildFormat.notFound(res, 'Username atau password salah')
    }

    return BuildFormat.success(res, 'Sukses', result.rows[0])
  } catch (err) {
    return BuildFormat.unautorize(res, 'Token tidak valid atau kadaluwarsa')
  }
}

export const createUser = async (req: Request, res: Response) => {
  const hashedPassword = await bcrypt.hash(req.body.password, 10)
  let data = {
    email: req.body.email,
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    password: hashedPassword
  }
  try {
    const result = await create(res, data)
    console.log(result.rows[0].id)
    if (result.rowCount !== 0) {
      await createDefault(res, result.rows[0].id)
      return BuildFormat.succesCreate(res, 'Registrasi berhasil silakan login')
    }
  } catch (err) {
    return BuildFormat.error(res, 'Registrasi gagal')
  }
}

export const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body

  try {
    const result = await getByEmail(res, email)
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
  const userId: number = (req as any).user.id
  let data: object = {
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    userId
  }
  try {
    const result = await updateData(res, data)

    if (result.rowCount !== 0) {
      const getProfile = await getById(res, userId)
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
    const result = await updateImageProfile(res, { profile_image, userId })
    if (result.rowCount !== 0) {
      const getProfile = await getById(res, userId)
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


