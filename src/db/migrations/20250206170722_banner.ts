import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('banners', (table) => {
    table.increments('id').primary()
    table.string('banner_name').notNullable()
    table.text('banner_image').notNullable()
    table.string('description')
    table.timestamps(true, true)
  })
}


export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists('banners')
}

