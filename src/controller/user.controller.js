/* eslint-disable camelcase */
import moment from 'moment';
import db from '../model/db';
import Authentication from '../middleware/Auth';
import Helper from '../helper/Helper';
import validate from '../helper/validate';
import { create_user, login_user } from '../model/user.model';


const User = {
  /**
   * Create A User
   * @param {object} req
   * @param {object} res
   * @returns {object} user object
   */

  async create(req, res) {
    const {
      first_name, last_name, email, password,
    } = req.body;
    let { is_admin } = req.body;

    if (!first_name || !last_name || !email || !password) {
      return res.status(400).json({
        status: 'error',
        error: 'All fields are required',
      });
    }

    // eslint-disable-next-line no-unused-expressions
    !is_admin ? is_admin = false : true;

    if (!validate.isValidEmail(email)) {
      return res.status(400).json({
        status: 'error',
        error: 'Please enter a valid email address',
      });
    }

    if (validate.passwordLength(password)) {
      return res.status(400).json({
        status: 'error',
        error: 'Password length too short',
      });
    }

    const hash_password = Helper.hash_password(req.body.password);

    const values = [
      first_name,
      last_name,
      email,
      hash_password,
      moment(new Date()),
      moment(new Date()),
      is_admin === 'admin',
    ];

    try {
      const { rows } = await db.query(create_user, values);
      // eslint-disable-next-line no-shadow
      const { user_id } = rows[0];
      const token = Authentication.generate_token(rows[0].user_id, rows[0].is_admin, rows[0].email);

      return res.status(201).json({
        status: 'success',
        data: {
          user_id,
          first_name,
          last_name,
          email,
          is_admin: rows[0].is_admin,
          token,
        },
      });
    } catch (error) {
      console.log(error);
      // check if email already exist
      if (error.routine === '_bt_check_unique') {
        return res.status(409).json({
          status: 'error',
          error: 'User with the email already exist',
        });
      }
      return res.status(500).json({
        status: 'error',
        error: 'Oops! Something went wrong, try again',
      });
    }
  },

  /**
  * User login
  * @param {object} req
  * @param {object} res
  * @returns {object} user object
  */
  async login(req, res) {
    // eslint-disable-next-line no-console
    if (!req.body.email || !req.body.password) {
      return res.status(400).json({
        status: 'error',
        error: 'Some values are missing',
      });
    }

    if (!validate.isValidEmail(req.body.email)) {
      return res.status(400).json({
        status: 'error',
        error: 'Please enter a valid email address',
      });
    }

    try {
      const { rows } = await db.query(login_user, [req.body.email]);
      if (!rows[0]) {
        res.status(401).json({
          status: 'error',
          error: 'Some values are missing',
        });
      }

      if (!Helper.compare_password(rows[0].password, req.body.password)) {
        res.status(400).json({
          status: 'error',
          error: 'Email or Password not correct',
        });
      }
      const {
        // eslint-disable-next-line camelcase
        user_id, first_name, email, is_admin,
      } = rows[0];
      // generate token
      const token = Authentication.generate_token(rows[0].user_id, is_admin, email);
      return res.status(201).json({
        status: 'success',
        data: {
          user_id,
          first_name,
          email,
          is_admin,
          token,
        },
      });
    } catch (error) {
      return res.status(401).json({
        status: 'error',
        error: 'The credentials you provided is incorrect',
      });
    }
  },
};

export default User;
