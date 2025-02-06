import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('services', (table) => {
    table.increments('id').primary()
    table.string('service_code').notNullable().unique()
    table.string('service_name').notNullable()
    table.text('service_icon').notNullable()
    table.decimal('service_tariff', 15, 0)
    table.timestamps(true, true)
  });
}


export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists('services')
}

