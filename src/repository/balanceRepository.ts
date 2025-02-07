import { Response } from 'express'
import { BuildFormat } from '../common/response'
import knex from '../db'

export const createDefault = async (res: Response, userId: number) => {
  try {
    const result = await knex.raw(
      'INSERT INTO user_balances (user_id) VALUES (?) RETURNING *',
      [userId]
    )
    return result
  } catch (err) {
    console.log(err)
    return BuildFormat.unautorize(res, 'Token tidak valid atau kadaluwarsa')
  }
}

export const getById = async (res: Response, id: number) => {
  try {
    const result = await knex.raw(
      'SELECT balance FROM user_balances WHERE user_id = ? LIMIT 1', [id]
    )
    return result
  } catch (err) {
    return BuildFormat.unautorize(res, 'Token tidak valid atau kadaluwarsa')
  }
}

export const getByIdFull = async (res: Response, id: number) => {
  try {
    const result = await knex.raw(
      'SELECT user_id, top_up_amount, total_spend, balance FROM user_balances WHERE user_id = ? LIMIT 1', [id]
    )
    return result
  } catch (err) {
    return BuildFormat.unautorize(res, 'Token tidak valid atau kadaluwarsa')
  }
}

export const topUpAmmount = async (res: Response, data: any) => {
  try {
    const result = await knex.raw(
      'UPDATE user_balances SET top_up_amount = ?, balance = ? WHERE user_id = ? RETURNING *',
      [data.top_up_amount, data.balance, data.userId]
    )

    return result
  } catch (err) {
    console.log(err)
    return BuildFormat.unautorize(res, 'Token tidak valid atau kadaluwarsa')
  }
}

export const spendTrx = async (res: Response, data: any) => {
  try {
    const result = await knex.raw(
      'UPDATE user_balances SET total_spend = ?, balance = ? WHERE user_id = ? RETURNING *',
      [data.total_spend, data.balance, data.userId]
    )

    return result
  } catch (err) {
    return BuildFormat.unautorize(res, 'Token tidak valid atau kadaluwarsa')
  }
}
