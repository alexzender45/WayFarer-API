/* eslint-disable camelcase */
/* eslint-disable camelcase */
import Debug from 'debug';

const { Pool } = require('pg');
const dotenv = require('dotenv');

dotenv.config();
const logger = new Debug('http');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

pool.on('connect', () => {
  logger('connected to the db');
});
const create_bus_table = () => {
  const Bus = `CREATE TABLE IF NOT EXISTS
 bus (
   bus_id SERIAL PRIMARY KEY,
   number_plate VARCHAR(128) UNIQUE NOT NULL,
   manufacturer VARCHAR(128),
   model VARCHAR(128),
   year VARCHAR(128),
   capacity INTEGER NOT NULL,
   created_on TIMESTAMP NOT NULL
   )`;

  pool.query(Bus).then((res) => {
    logger(res);
    pool.end();
  }).catch((err) => {
    logger(err);
    pool.end();
  });
};

export const drop_bus_table = async () => {
  const client = await pool.connect();
  const queryText = 'DROP TABLE IF EXISTS bus';
  try {
    logger('Dropping bus table');
    const response = await client.query(queryText);
    logger(response);
  } catch (error) {
    logger(error);
  } finally {
    client.release();
  }
};
const create_bus_query = `INSERT INTO 
bus (number_plate, manufacturer, model, year, capacity, created_on) 
      VALUES($1, $2, $3, $4, $5, $6) 
      returning bus_id, number_plate, capacity`;

// eslint-disable-next-line camelcase
const get_all_bus_query = 'SELECT * FROM bus';
pool.on('remove', () => {
  logger();
  process.exit(0);
});
export {
  create_bus_table,
  create_bus_query,
  get_all_bus_query,
};
