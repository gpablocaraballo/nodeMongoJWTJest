'use strict';
const mongoose = require( 'mongoose' );
const Util = require( '../libs/util' );
const { MESSAGES } = require( '../libs/constants' );
const Schema = mongoose.Schema;

const userSchema = Schema({
  username:   { type: String, required: true },
  password:   { type: String, required: true },
  pseudonym:  { type: String, required: true },
  superAdmin:  { type: Boolean, default: false },
  createdAt: {
    type: Date,
    default: Date.now
  }, 
});

// https://stackoverflow.com/questions/18628656/model-find-returns-empty-in-mongoose
userSchema.set('collection', 'User');

userSchema.statics = {
  /**
     * @param {string} username
     * @param {string} password
     * @param {string} pseudonym
     * @returns {Object}
     */
  validateUser({ username, password, pseudonym }) {
    const errors = [];
    if (!username || Util.myTrim(username) === '') {
      errors.push(MESSAGES.FIELDS_USERNAME_REQ);
    }
    if (!pseudonym || Util.myTrim(pseudonym) === '') {
      errors.push(MESSAGES.FIELDS_PSEUDONYM_REQ);
    }
    if (!password || Util.myTrim(password) === '') {
      errors.push(MESSAGES.FIELDS_PASSWORD_REQ);
    } else {
      // eslint-disable-next-line no-useless-escape
      const strongRegex = new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#,;.\$%\^&\*])(?=.{8,})');
      if (!strongRegex.test(password)) {
        errors.push(MESSAGES.FIELDS_PASSWORD_REGEX_MESSAGE);
      }
    }
    return { valid: !errors.length, errors };
  },
  
  /**
     * @param {string} username
     * @param {string} password
     * @returns {Object}
     */
  validateLoginData({ username, password }) {
    const errors = [];
    !username && (errors.push(MESSAGES.FIELDS_USERNAME_REQ));
    !password && (errors.push(MESSAGES.FIELDS_PASSWORD_REQ));

    return { valid: !errors.length, errors };
  },
  isValidId(myId) {
    return mongoose.Types.ObjectId.isValid(myId);
  },
  getObjectId(myId) {
    return mongoose.Types.ObjectId(myId);
  },    
};

module.exports = mongoose.model('User', userSchema);