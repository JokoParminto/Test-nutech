import { Response } from 'express'
import { BuildFormat } from '../common/response'
import knex from '../db'

export const getAll = async (res: Response) => {
  try {
    const result = await knex.raw(
      'SELECT service_code, service_name, service_icon, service_tariff FROM services'
    )
    return result
  } catch (err) {
    return BuildFormat.notFound(res, 'Data tidak ditemukan')
  }
}

export const getByServiceCode = async (res: Response, code: string) => {
  try {
    const result = await knex.raw(
      'SELECT id, service_code, service_name, service_icon, service_tariff FROM services WHERE service_code = ? LIMIT 1', [code]
    )
    return result
  } catch (err) {
    return BuildFormat.unautorize(res, 'Token tidak valid atau kadaluwarsa')
  }
}