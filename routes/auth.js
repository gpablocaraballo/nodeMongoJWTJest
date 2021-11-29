'use strict';
const express = require( 'express');
const auth = require( '../controllers/auth' );
const { MESSAGES } = require( '../libs/constants' );
const router = express.Router();

router.get('/test', (req, res) =>
  res.status(200).sendData({ msg: MESSAGES.AUTH_ENDPOINT_TEST})
);
router.post( '/login', auth.login );

module.exports = router;