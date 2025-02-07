import { Request, Response } from 'express'
import { BuildFormat } from "../common/response"
import { getByServiceCode } from '../repository/serviceRepository'
import { getByIdFull, spendTrx } from '../repository/balanceRepository'
import { generateInvNumber } from '../common/helper'
import { createTrxes, getAll } from '../repository/transactionRepository'

export const createTrx = async (req: Request, res: Response) => {
  const userId: number = (req as any).user.id
  let data: any = {
    service_code: req.body.service_code
  }
  try {
    const getService = await getByServiceCode(res, data.service_code)
    const getBalance = await getByIdFull(res, userId)
      if (parseInt(getService.rows[0].service_tariff) > parseInt(getBalance.rows[0].balance)) {
        return BuildFormat.error(res, 'Saldo tidak cukup')
      } else {
        let createData = {
          invoice_number: await generateInvNumber(),
          userId: userId,
          service_id: getService.rows[0].id,
          transaction_type: 'PAYMENT',
          description: getService.rows[0].service_name,
          total_amount: parseInt(getService.rows[0].service_tariff)
        }
        const result = await createTrxes(res, createData)
        if (result.rowCount !== 0) {
          await spendTrx(res, {
            total_spend: parseInt(getBalance.rows[0].total_spend) + parseInt(getService.rows[0].service_tariff),
            balance: parseInt(getBalance.rows[0].balance) - parseInt(getService.rows[0].service_tariff),
            userId: userId
          })
          console.log(result.rows[0])
          return BuildFormat.success(res, 'Transaksi berhasil', {
            invoice_number: result.rows[0].invoice_number,
            service_code: getService.rows[0].service_code,
            service_name: getService.rows[0].service_name,
            transaction_type: result.rows[0].transaction_type,
            total_amount: result.rows[0].total_amount,
            created_on: result.rows[0].created_at
          })
        }
      }
    
  } catch (err) {
    return BuildFormat.unautorize(res, 'Token tidak valid atau kadaluwarsa')
  } 
}

export const getListTrx = async (req: Request, res: Response) => {
  console.log(req.query)
  let params: any = req.query
  try {
    let limit = params.limit ? parseInt(params.limit) : 10
    let page = params.offset ? parseInt(params.offset) : 1
    let offset = (Number(limit) - 1) * Number(page)

    const result = await getAll(res, limit, offset)
    if (result.rowCount === 0) {
      return BuildFormat.notFound(res, 'Data tidak ditemukan')
    }
    
    return BuildFormat.successPagination(res, 'Sukses', offset, limit, result.rows)
  } catch (err) {
    return BuildFormat.unautorize(res, 'Token tidak valid atau kadaluwarsa')
  }
}