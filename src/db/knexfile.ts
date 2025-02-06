import dotenv from 'dotenv';
import path from 'path';
import { Knex } from 'knex';
dotenv.config({ path: path.resolve(__dirname, '../../.env') });


const knexConfig: Knex.Config = {
  client: 'pg',
  connection: {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
  },
  migrations: {
    directory: path.join(__dirname, 'migrations'),
    extension: 'ts',
  },
  seeds: {
    directory: path.join(__dirname, 'seeds'),
  },
};

export default knexConfig