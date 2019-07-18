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
// Trip
const create_trip_table = () => {
  const Trips = `CREATE TABLE IF NOT EXISTS
trip (
  trip_id SERIAL UNIQUE,
  bus_id SERIAL NOT NULL UNIQUE,
  origin VARCHAR(128) NOT NULL,
  destination VARCHAR(128) NOT NULL,
  trip_date TIMESTAMP NOT NULL,
  fare FLOAT(4) NOT NULL,
  status VARCHAR(64) NOT NULL,
  created_on TIMESTAMP DEFAULT Now(),
  modified_on TIMESTAMP NOT NULL,
  PRIMARY KEY (trip_id, bus_id),
  FOREIGN KEY (bus_id) REFERENCES bus(bus_id)
)`;

  pool.query(Trips).then((res) => {
    logger(res);
    pool.end();
  }).catch((err) => {
    logger(err);
    pool.end();
  });
};

export const drop_trip_table = async () => {
  const client = await pool.connect();
  const queryText = 'DROP TABLE IF EXISTS trip';
  try {
    logger('Dropping trip table');
    const response = await client.query(queryText);
    logger(response);
  } catch (error) {
    logger(error);
  } finally {
    client.release();
  }
};

const create_trip_query = `INSERT INTO 
trip (bus_id, created_on, origin, destination, trip_date, fare, status, modified_on) 
      VALUES($1, $2, $3, $4, $5, $6, $7, $8) 
      returning trip_id, bus_id, origin, destination, trip_date, fare, status`;

const get_all_trip_query = 'SELECT * FROM trip';
const bus_availability = 'SELECT * FROM trip WHERE (trip_date = $1 AND bus_id = $2 AND status = $3)';
const cancel_a_trip_query = 'UPDATE trip SET status=$1, modified_on=$2 WHERE trip_id=$3 returning *';
// eslint-disable-next-line import/prefer-default-export

pool.on('remove', () => {
  logger();
  process.exit(0);
});

export {
  create_trip_query,
  bus_availability,
  get_all_trip_query,
  cancel_a_trip_query,
  create_trip_table,
};
