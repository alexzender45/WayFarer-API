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

const create_user_table = () => {
  // users
  const Users = `CREATE TABLE IF NOT EXISTS 
  users (
    user_id SERIAL PRIMARY KEY,
    first_name VARCHAR (128) NOT NULL,
    last_name VARCHAR(128) NOT NULL,
    email VARCHAR (254) UNIQUE NOT NULL,
    password VARCHAR(128) NOT NULL,
    created_on TIMESTAMP DEFAULT Now(),
    modified_on TIMESTAMP NOT NULL,
    is_admin BOOLEAN NOT NULL DEFAULT ('FALSE')
   )`;

  pool.query(Users).then((res) => {
    logger(res);
    logger('users');
    pool.end();
  }).catch((err) => {
    logger(err);
    pool.end();
  });
};

/**
 * Drop Tables
 * @returns {*} void
 */
export const drop_user_table = async () => {
  const client = await pool.connect();
  const queryText = 'DROP TABLE IF EXISTS Users';
  try {
    logger('Dropping Users table');
    const response = await client.query(queryText);
    logger(response);
  } catch (error) {
    logger(error);
  } finally {
    client.release();
  }
};
const create_user = `INSERT INTO 
      users(first_name, last_name, email, password, created_on, modified_on, is_admin) 
      VALUES($1, $2, $3, $4, $5, $6, $7) 
      returning *`;

const login_user = 'SELECT * FROM users WHERE email = $1';

pool.on('remove', () => {
  logger();
  process.exit(0);
});


export { create_user, login_user, create_user_table };
