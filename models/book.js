'use strict';
const mongoose = require( 'mongoose' );
const Util = require( '../libs/util' );
const { MESSAGES } = require( '../libs/constants' );
const Schema = mongoose.Schema;

const bookSchema = Schema({
  title:   { type: String, required: true },
  description:   { type: String, required: true },
  cover:  { type: String, required: true },
  price:  { type: Number, required: true },
  author :{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }, 
});

bookSchema.set('collection', 'Book');

bookSchema.statics = {
  /**
     * @param {string} title
     * @param {string} description
     * @param {string} cover
     * @param {number} price
     * @param {string} userId
     * @returns {Object}
     */
  validateBook({ title, description, cover, price }) {
    const errors = [];
    if (!title || Util.myTrim(title) === '') {
      errors.push(MESSAGES.FIELDS_TITLE_REQ);
    }
    if (!description || Util.myTrim(description) === '') {
      errors.push(MESSAGES.FIELDS_DESCRIPTION_REQ);
    }
    if (!cover || Util.myTrim(cover) === '') {
      errors.push(MESSAGES.FIELDS_COVER_REQ);
    }
    if (!Number(price)) {
      errors.push(MESSAGES.FIELDS_PRICE_REQ);
    }
    return { valid: !errors.length, errors };
  },
  isValidId(myId) {
    return mongoose.Types.ObjectId.isValid(myId);
  },
};

module.exports = mongoose.model('Book', bookSchema);