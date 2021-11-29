'use strict';
const jwt = require( 'jsonwebtoken' );
const config   = require( '../libs/config' );
const { MESSAGES } = require( '../libs/constants' );

/***********************************************************************************
****************** Functions invoked when passing routes ***************************
************************************************************************************/
const verifyToken = (token) => {
  if (!token) {
    return {valid: false};
  }
  const isVerifyToken = jwt.verify(
    token, 
    config.JWT_PASSPHRASE,
    (err, dataUserLogged) => {
      if (err) {
        return {valid:false};
      } else {
        if (dataUserLogged && dataUserLogged.auth && dataUserLogged.auth.userId) {
          return {valid:true, auth: dataUserLogged.auth};
        }
        return {valid: false};
      }
    }
  );
  return isVerifyToken;
};
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.replace('Bearer ', ''); // we get only the token itself
  const validationResult = verifyToken(token);
    
  if (validationResult.valid) {
    req.auth = validationResult.auth;
    next();
  } else {
    res.status( 401 ).sendData( { error: true, msg: MESSAGES.UNAUTHORIZED } );
  }
};
const checkAdminPermissions = (req, res, next) => {
  // only a superadmin user can see this list
  if (req.auth.superAdmin) {
    next();
  } else {
    res.status( 403 ).sendData( { error: true, msg: MESSAGES.UNAUTHORIZED } );
  }
};
module.exports = {
  authenticateToken,
  checkAdminPermissions,
};