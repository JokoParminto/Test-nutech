import { Request, Response } from 'express'
import knex from '../db'
import { BuildFormat } from "../common/response"

export const getList = async (req: Request, res: Response) => {
  try {
    const result = await knex.raw(
      'SELECT banner_name, banner_image, description FROM banners'
    )
    if (result.rowCount === 0) {
      return BuildFormat.notFound(res, 'Data tidak ditemukan')
    }

    return BuildFormat.success(res, 'Sukses', result.rows)
  } catch (err) {
    return BuildFormat.unautorize(res, 'Token tidak valid atau kadaluwarsa')
  }
}