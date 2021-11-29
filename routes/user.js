'use strict';
const express = require( 'express');
const user = require( '../controllers/user' );
const autorization = require( '../middleware/autorization' );
const { MESSAGES } = require( '../libs/constants' );
const router = express.Router();

router.get('/test', (req, res) =>
  res.status(200).sendData({ msg: MESSAGES.USER_ENDPOINT_TEST })
);
router.post( '/register', user.register );
router.patch( '/update', autorization.authenticateToken, user.update );
router.get( '/detail', autorization.authenticateToken, user.detail );
router.post( '/publish', autorization.authenticateToken, user.publish );
router.delete( '/unpublish/:bookId', autorization.authenticateToken, user.unpublish );

module.exports = router;