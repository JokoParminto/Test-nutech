import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('users', (table) => {
    table.increments('id').primary()
    table.string('email').notNullable().unique()
    table.string('first_name').notNullable()
    table.string('last_name').notNullable()
    table.string('password').notNullable()
    table.text('profile_image').defaultTo('https://myprofile.com/image.jpg')
    table.timestamps(true, true)
  })
}


export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists('users')
}

