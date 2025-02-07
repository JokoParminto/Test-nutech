import { Request, Response } from 'express'
import { BuildFormat } from "../common/response"
import { getAll } from '../repository/bannerRepository'

export const getList = async (req: Request, res: Response) => {
  try {
    const result = await getAll(res)
    if (result.rowCount === 0) {
      return BuildFormat.notFound(res, 'Data tidak ditemukan')
    }

    return BuildFormat.success(res, 'Sukses', result.rows)
  } catch (err) {
    return BuildFormat.unautorize(res, 'Token tidak valid atau kadaluwarsa')
  }
}