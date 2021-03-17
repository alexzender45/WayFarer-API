
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

// Bookings
const create_booking_table = () => {
  const Bookings = `CREATE TABLE IF NOT EXISTS
booking(
  booking_id SERIAL PRIMARY KEY,
  user_id SERIAL NOT NULL,
  trip_id SERIAL NOT NULL,
  created_on TIMESTAMP DEFAULT Now(),
  bus_id SERIAL NOT NULL,
  trip_date TIMESTAMP NOT NULL,
  seat_number INTEGER NOT NULL,
  first_name VARCHAR (128) NOT NULL,
  last_name VARCHAR (128) NOT NULL,
  email VARCHAR (355) NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(user_id),
  FOREIGN KEY (trip_id) REFERENCES trip(trip_id)
  )`;
  pool.query(Bookings).then((res) => {
    logger(res);
    pool.end();
  }).catch((err) => {
    logger(err);
    pool.end();
  });
};

export const drop_booking_table = async () => {
  const client = await pool.connect();
  const queryText = 'DROP TABLE IF EXISTS booking';
  try {
    logger('Dropping booking table');
    const response = await client.query(queryText);
    logger(response);
  } catch (error) {
    logger(error);
  } finally {
    client.release();
  }
};
const book_trip_query = `INSERT INTO 
booking (user_id, trip_id, created_on, bus_id, trip_date, seat_number, first_name, last_name, email) 
      VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9) 
      RETURNING booking_id, user_id, trip_id, created_on, bus_id, trip_date, seat_number, first_name, last_name, email`;

const get_trip_query = 'SELECT * FROM trip WHERE trip_id = $1';
const find_user_query = 'SELECT * FROM users WHERE user_id = $1';
const check_booked_query = 'SELECT * FROM booking WHERE (trip_id = $1 and user_id = $2)';

const get_all_admin_booking_query = 'SELECT * FROM booking';
const get_all_user_booking_query = 'SELECT * FROM booking WHERE user_id = $1';
const delete_booking = 'DELETE FROM booking WHERE (booking_id = $1 and user_id = $2) returning *';

pool.on('remove', () => {
  logger();
  process.exit(0);
});

export {
  book_trip_query,
  get_trip_query,
  find_user_query,
  check_booked_query,
  get_all_admin_booking_query,
  get_all_user_booking_query,
  delete_booking,
  create_booking_table,
};
