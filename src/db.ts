import Knex from 'knex';
import knexConfig from './db/knexfile'

const knex = Knex(knexConfig)

export default knex 
