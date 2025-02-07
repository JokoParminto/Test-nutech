import { Response } from 'express'
import { BuildFormat } from '../common/response'
import knex from '../db'

export const getById = async (res: Response, id: number) => {
  try {
    const result = await knex.raw(
      'SELECT email, first_name, last_name, profile_image FROM users WHERE id = ? LIMIT 1', [id]
    )
    return result
  } catch (err){
    return BuildFormat.unautorize(res, 'Token tidak valid atau kadaluwarsa')
  }
}

export const create = async (res: Response, data: any) => {
  try {
    const result = await knex.raw(
      'INSERT INTO users (email, first_name, last_name, password) VALUES (?, ?, ?, ?) RETURNING *',
      [data.email, data.first_name, data.last_name, data.password]
    )
    
    return result
  } catch(err){
    console.log(err)
    return BuildFormat.error(res, 'Registrasi gagal')
  }
}

export const getByEmail = async (res: Response, email: string) => {
  try {
    const result = await knex.raw(
      'SELECT * FROM users WHERE email = ? LIMIT 1', [email]
    )
    return result
  } catch (err) {
    return BuildFormat.unautorize(res, 'Token tidak valid atau kadaluwarsa')
  }
}

export const updateData = async (res: Response, data: any) => {
  try {
    const result = await knex.raw(
      'UPDATE users SET first_name = ?, last_name = ? WHERE id = ?',
      [data.first_name, data.last_name, data.userId]
    )
    return result
  } catch (err) {
    return BuildFormat.unautorize(res, 'Token tidak valid atau kadaluwarsa')
  }
}

export const updateImageProfile = async (res: Response, data: any) => {
  try {
    const result = await knex.raw(
      'UPDATE users SET profile_image = ? WHERE id = ?',
      [data.profile_image, data.userId]
    )
    return result
  } catch (err) {
    return BuildFormat.failed(null, 'Format Image tidak sesuai')
  }
}

