/* eslint-disable camelcase */
import bcrypt from 'bcrypt';

const Helper = {
  /**
   * Hash Password Method
   * @param {string} password
   * @returns {string} returns hashed password
   */
  hash_password(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8));
  },
  /**
   * compare_password
   * @param {string} hash_password
   * @param {string} password
   * @returns {Boolean} return True or False
   */
  compare_password(hash_password, password) {
    return bcrypt.compareSync(password, hash_password);
  },
};

export default Helper;
