import knex from '../db'

export const generateInvNumber = async () => {
  let id: number = 0
  try {
    const result = await knex.raw(
      'SELECT id FROM trxes order by id desc LIMIT 1'
    )
    if (result.rowCount === 0) {
      id = 1
    } else {
      id = result.rows[0].id + 1
    }
    const date = new Date()
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, "0")
    return `INV-${year}${month}-${id.toString().padStart(4, "0")}`
  } catch (err) {
    return err
  }
}