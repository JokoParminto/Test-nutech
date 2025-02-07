import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('user_balances', (table) => {
    table.increments('id').primary()
    table.integer('user_id').notNullable()
    table.decimal('top_up_amount', 15, 0).defaultTo(0)
    table.decimal('total_spend', 15, 0).defaultTo(0)
    table.decimal('balance', 15, 0).defaultTo(0)
    table.timestamps(true, true)
  })
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists('user_balances')
}

