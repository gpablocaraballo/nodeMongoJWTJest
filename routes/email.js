'use strict';
const express = require( 'express');
const email = require( '../controllers/email' );
const router = express.Router();

router.get('/test', (req, res) =>
  res.status(200).sendData({ msg: 'email works' })
);
router.post( '/send', email.sendEmailPost );
router.get( '/send', email.sendEmailGet );

module.exports = router;