'use strict';
const User   = require( '../models/user' );
const BlockedPublishers = require( '../models/blockedPublishers');
const Util = require( '../libs/util' );
const { MESSAGES } = require( '../libs/constants' );

// just the list of all users
const list = async (req, res ) => {
  const result = await User.find({});
  if (result) {
    res.status( 200 ).sendData( { users: result } );
  } else {
    res.status( 400 ).sendData( { error: true, msg: MESSAGES.SOMETHING_WRONG } );
  }
};
// the list of users that can not publish books (e.g. Darth Vader)
const blockedList = async (req, res ) => {
  const result = await BlockedPublishers.find({});
  if (result) {
    res.status( 200 ).sendData( { users: result } );
  } else {
    res.status( 400 ).sendData( { error: true, msg: MESSAGES.SOMETHING_WRONG } );
  }
};
// if you are super admin you can put on the blocked list almost any user
const blockAuthor = async (req, res ) => {
  if (req.params && req.params.userId && User.isValidId(req.params.userId)) {
    // you can not block yourself
    if (req.params.userId === req.auth.userId) {
      res.status( 403 ).sendData( { error: true, msg: MESSAGES.YOU_CANT_DO_THIS } );
      return;
    }        
    // is already blocked?
    const blockedUser = await BlockedPublishers.findOne ({ 'author' : User.getObjectId(req.params.userId) });
    if (blockedUser) {
      res.status( 403 ).sendData( { error: true, msg: MESSAGES.AUTHOR_ALREADY_BLOCKED } );
      return;
    }
    //a super admin can not block another super admin, (must do/force it manually if its needed)
    const commonUser = await User.findOne ({ '_id' : req.params.userId });
    if (!commonUser) {
      res.status( 404 ).sendData( { error: true, msg: MESSAGES.USER_NOT_FOUND } );
      return;
    }
    if (commonUser.isSuperAdmin) {
      res.status( 405 ).sendData( { error: true, msg: MESSAGES.YOU_CANT_DO_THIS } );
      return;
    }
    const foundUser = await User.findOne ({ '_id' : req.params.userId });
    if (!foundUser) {
      res.status( 404 ).sendData( { error: true, msg: MESSAGES.UNKNOWN_AUTHOR } );
      return;
    }        
    const blockedPublisher = new BlockedPublishers();
    blockedPublisher.author = User.getObjectId(foundUser._id);
    await blockedPublisher.save();
    res.status( 200 ).sendData( { msg: MESSAGES.SUCCESS } );
  } else {
    res.status( 400 ).sendData( { error: true, msg: MESSAGES.SOMETHING_WRONG } );
  }
};
const removeUser = async (req, res ) => {
  try {        
    if (req.params && req.params.userId && User.isValidId(req.params.userId)) {
      // you can not block yourself
      if (req.params.userId === req.auth.userId) {
        res.status( 403 ).sendData( { error: true, msg: MESSAGES.YOU_CANT_DO_THIS } );
        return;
      }
      // user not found
      const commonUser = await User.findOne ({ '_id' : req.params.userId });
      if (!commonUser) {
        res.status( 404 ).sendData( { error: true, msg: MESSAGES.USER_NOT_FOUND } );
        return;
      }
      //a super admin can not remove another super admin, (must do/force it manually if its needed)
      if (commonUser.isSuperAdmin) {
        res.status( 405 ).sendData( { error: true, msg: MESSAGES.YOU_CANT_DO_THIS } );
        return;
      }
      const filter = {_id: req.params.userId}; // ONLY SUPER ADMIN CAN REMOVE AN USER
      User.findOneAndDelete(filter, (err, result) => {
        if (err) {
          res.status( 400 ).sendData( { error: true, msg: MESSAGES.SOMETHING_WRONG } );
        } else {
          if (result) {
            res.status( 200 ).sendData( { msg: MESSAGES.SUCCESS_DELETED } );
          } else {
            res.status( 404 ).sendData( { msg: MESSAGES.USER_NOT_FOUND } );
          }
        }
      });
    } else {
      res.status( 400 ).sendData( { error: true, msg: MESSAGES.SOMETHING_WRONG } );
    }
  } catch (error) {
    Util.log(error);
    res.status( 400 ).sendData( { error: true, msg: MESSAGES.SOMETHING_WRONG } );
  }
};

module.exports = {
  list,
  blockedList,
  blockAuthor,
  removeUser,
};