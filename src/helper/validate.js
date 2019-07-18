/* eslint-disable consistent-return */
const validate = {
  isValidEmail(email) {
    return /\S+@\S+\.\S+/.test(email);
  },

  passwordLength(password) {
    return /^\w{1,6}$/.test(password);
  },
};

export default validate;
