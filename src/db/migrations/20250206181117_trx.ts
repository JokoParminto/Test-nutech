import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('trxes', (table) => {
    table.increments('id').primary()
    table.string('invoice_number', 50).notNullable().unique()
    table.integer('user_id').notNullable()
    table.string('transaction_type').notNullable()
    table.text('description')
    table.decimal('total_amount', 15, 0).defaultTo(0)
    table.timestamps(true, true)
  })
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists('user_balances')
}

