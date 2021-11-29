'use strict';
const express = require( 'express');
const book = require( '../controllers/book' );
const { MESSAGES } = require( '../libs/constants' );
const router = express.Router();

router.get('/test', (req, res) =>
  res.status(200).sendData({ msg: MESSAGES.BOOK_ENDPOINT_TEST})
);
router.get( '/list', book.list );
router.get( '/detail', book.detail );

module.exports = router;