import { Response } from 'express'
import { BuildFormat } from "../common/response"
import knex from '../db'

export const createTrxes = async (res: Response, data: any) => {
  try {
    const result = await knex.raw(
      'INSERT INTO trxes (invoice_number, user_id, service_id, transaction_type, description, total_amount) VALUES (?, ?, ?, ?, ?, ?) RETURNING *',
      [data.invoice_number, data.userId, data.service_id, data.transaction_type, data.description, data.total_amount]
    )
    return result
  } catch (err) {
    return BuildFormat.unautorize(res, 'Token tidak valid atau kadaluwarsa')
  }
}

export const getAll = async (res: Response, limit: number, offset: number) => {
  try {
    const result = await knex.raw(
      'SELECT * FROM trxes  ORDER BY created_at DESC LIMIT ? OFFSET ?',
      [Number(limit), offset]
    )
    return result
  } catch (err) {
    console.log(err)
    return BuildFormat.notFound(res, 'Data tidak ditemukan')
  }
}