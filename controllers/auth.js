'use strict';
const jwt = require( 'jsonwebtoken' );
const bcrypt = require( 'bcryptjs' );
const config   = require( '../libs/config' );
const User   = require( '../models/user' );
const Util = require( '../libs/util' );
const { MESSAGES } = require( '../libs/constants' );

/***********************************************************************************
****************** Functions invoked when passing routes ***************************
************************************************************************************/
const passwordMatch = (password, userPassword) => {
  return bcrypt.compare(password, userPassword);
};
const login = async ( req, res )  => {
  const fields = req.body; // user postman client with Body x-www-form-urlencoded to pass params

  // Check for errors
  const { valid, errors } = User.validateLoginData(req.body);
  if (!valid) {
    res.status( 400 ).sendData( { error: true, errors } );
    return; 
  }
  const foundUser = await User.findOne ({ 'username' : fields.username });
  if (!foundUser) {
    res.status( 404 ).sendData( { error: true, msg: MESSAGES.USER_NOT_FOUND } );
    return;         
  }

  try {
    //Is match password
    const isMatch = await passwordMatch(fields.password, foundUser.password);
    if (!isMatch) {
      return res.status(401).sendData( { error: true, msg: MESSAGES.USERNAME_PASSWORD_INCORRECT } );
    }

    // Create JWT Payload
    const payload = {
      auth: {
        userId: foundUser._id,
        username: fields.username,
        pseudonym: foundUser.pseudonym,
        superAdmin: foundUser.superAdmin,
      }
    };

    // Sign Token with payload
    jwt.sign(payload, config.JWT_PASSPHRASE, { expiresIn: 36000 }, (err, token) => {
      if (err) {
        return res
          .status(400)
          .sendData( { error: true, msg: MESSAGES.LOGIN_FAILED } );
      }
      return res.status(200).sendData({ token });
    });
  }   catch (err) {
    Util.log(err);
    return res.status(500).sendData( { error: true, msg: MESSAGES.SOMETHING_WRONG } );
  }
};
module.exports = {
  login,
};