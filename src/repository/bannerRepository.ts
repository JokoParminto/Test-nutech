import { Response } from 'express'
import { BuildFormat } from '../common/response'
import knex from '../db'

export const getAll = async (res: Response) => {
  try {
    const result = await knex.raw(
      'SELECT banner_name, banner_image, description FROM banners'
    )
    return result
  } catch (err) {
    return BuildFormat.notFound(res, 'Data tidak ditemukan')
  }
}