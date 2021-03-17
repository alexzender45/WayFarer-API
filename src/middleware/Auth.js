import jwt from 'jsonwebtoken';

import db from '../model/db';

const Authentication = {
  /**
     * Generate token
     *
     * @param {*} user_id
     * @param {*} email
     * @param {*} is_admin
     */

  // eslint-disable-next-line camelcase
  generate_token(user_id, is_admin, email) {
    const token = jwt.sign({ user_id, is_admin, email },
      process.env.SECRET, {
        expiresIn: '7d',
      });
    return token;
  },

  /**
   * Verifies user provided token
   *
   * @param {*} req
   * @param {*} res
   * @param {*} next
   */

  async verify_token(req, res, next) {
    const { token } = req.headers;
    try {
      // verify user provided token
      const decoded = await jwt.verify(token, process.env.SECRET);
      const text = 'SELECT * FROM users WHERE user_id = $1';
      const { rows } = await db.query(text, [decoded.user_id]);
      // check valid users
      if (!rows[0]) {
        return res.status(401).json({
          status: 'error',
          error: 'Token provided is invalid',
        });
      }

      req.user = decoded.user_id;
      req.admin = decoded.is_admin;

      return next();
    } catch (error) {
      console.log(error);
      // eslint-disable-next-line no-cond-assign
      if (error.name === 'tokenExpiredError') {
        return res.status(401).json({
          status: 'error',
          error: 'Token Expired, please login again',
        });
      }
      return res.status(400).json({
        status: 400,
        error: 'Ooops! Something went wrong.',
      });
    }
  },
};

export default Authentication;
