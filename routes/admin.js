'use strict';
const express = require( 'express');
const admin = require( '../controllers/admin' );
const autorization = require( '../middleware/autorization' );
const { MESSAGES } = require( '../libs/constants' );
const router = express.Router();

router.get('/test', (req, res) =>
  res.status(200).sendData({ msg: MESSAGES.ADMIN_ENDPOINT_TEST })
);
router.get( '/list', autorization.authenticateToken, autorization.checkAdminPermissions, admin.list );
router.get( '/blockedpublishers', autorization.authenticateToken, autorization.checkAdminPermissions, admin.blockedList );
router.post( '/blockauthor/:userId', autorization.authenticateToken, autorization.checkAdminPermissions, admin.blockAuthor );
router.delete( '/remove/:userId', autorization.authenticateToken, autorization.checkAdminPermissions, admin.removeUser );

module.exports = router;