import config from './knexfile';
import knex from 'knex';

const env = process.env.ENV || 'development';

const connection = knex(config[env]);

export default connection;