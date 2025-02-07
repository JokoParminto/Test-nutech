import { Request, Response } from 'express'
import { BuildFormat } from "../common/response"
import { getById, topUpAmmount } from '../repository/balanceRepository'

export const getList = async (req: Request, res: Response) => {
  const userId: number = (req as any).user.id
  try {
    const result = await getById(res, userId)
    if (result.rowCount === 0) {
      return BuildFormat.notFound(res, 'Data tidak ditemukan')
    }
    result.rows[0].balance = parseInt(result.rows[0].balance)
    return BuildFormat.success(res, 'Sukses', result.rows[0])
  } catch (err) {
    return BuildFormat.unautorize(res, 'Token tidak valid atau kadaluwarsa')
  }
}

export const topup = async (req: Request, res: Response) => {
  const userId: number = (req as any).user.id
  let data: any = {
    top_up_amount: req.body.top_up_amount
  }
  try {
    const getBalance = await getById(res, userId)
    if (getBalance.rowCount !== 0) {
      data.balance = parseInt(getBalance.rows[0].balance) + req.body.top_up_amount
      data.userId = userId
      const result = await topUpAmmount(res, data)
      if (result.rowCount !== 0) {
        return BuildFormat.success(res, 'Top Up Balance berhasil', {
          balance: parseInt(result.rows[0].balance)
        })
      }
    }
  } catch (err) {
    return BuildFormat.unautorize(res, 'Token tidak valid atau kadaluwarsa')
  }
}
