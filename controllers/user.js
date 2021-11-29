'use strict';
const bcrypt = require( 'bcryptjs' );
const User   = require( '../models/user' );
const Book   = require( '../models/book' );
const BlockedPublishers = require( '../models/blockedPublishers');
const Util = require( '../libs/util' );
const { MESSAGES } = require( '../libs/constants' );

/***********************************************************************************
****************** Functions invoked when passing routes ***************************
************************************************************************************/
const register = async ( req, res )  => {
  const fields = req.body; // user postman client with Body x-www-form-urlencoded to pass params

  // Check for errors
  const { valid, errors } = await User.validateUser(fields);
  if (!valid) {
    res.status( 400 ).sendData( { error: true, errors } );
    return; 
  }
  const foundUser = await User.findOne ({ 'username' : fields.username });
  if (foundUser) {
    res.status( 400 ).sendData( { error: true, msg: MESSAGES.USER_NAME_IN_USE } );
    return;         
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(fields.password, 12);
  const user   = new User();
  user.username = fields.username;
  user.password = hashedPassword;
  user.pseudonym = fields.pseudonym;

  try {
    await user.save();
    return res.status( 200 ).sendData( { msg: MESSAGES.SUCCESS } );
  } catch (error) {
    Util.log(error);
    res.status( 400 ).sendData( { error: true, msg: MESSAGES.SOMETHING_WRONG } );
  }
};
// ONLY CAN CHANGE PSEUDONYM
const update = (req, res ) => {
  const fields = req.body;
    
  if (fields && fields.pseudonym && Util.myTrim(fields.pseudonym) !== '') {
    User.findOneAndUpdate(
      { _id: req.auth.userId }, 
      { pseudonym: Util.myTrim(fields.pseudonym) },
      { upsert: true, new: true }, 
      ( err, user ) => {
        if  (err) {
          res.status( 400 ).sendData( { error: true, msg: MESSAGES.SOMETHING_WRONG } );
        }   else {
          if (!user) {
            res.status( 404 ).sendData( { error: true, msg: MESSAGES.USER_NOT_FOUND } );
          } else {
            res.status( 200 ).sendData( { msg: MESSAGES.SUCCESS } ); 
          }
        }
      });
  } else {
    res.status( 400 ).sendData( { error: true, msg: MESSAGES.FIELDS_PSEUDONYM_REQ } );
  }
};
const detail = async (req, res ) => {
  // find the authenticated user in db.
  const foundUser = await User.findOne ({ '_id' : req.auth.userId });
  if (foundUser) {
    res.status( 200 ).sendData( { username: foundUser.username, pseudonym: foundUser.pseudonym } );
  } else {
    res.status( 404 ).sendData( { error: true, msg: MESSAGES.USER_NOT_FOUND } );
  }
};
const publish = async (req, res)  => {
  const fields = req.body; // use postman client with Body x-www-form-urlencoded to pass params
  const book   = new Book();

  // Check for errors
  const { valid, errors } = await Book.validateBook(fields);
  if (!valid) {
    res.status( 400 ).sendData( { error: true, errors } );
    return; 
  }
  // comment: you ONLY can publish your own books, "with" your token you get your "user id" and save on the new book.
  const foundUser = await User.findOne ({ '_id' : req.auth.userId });
  if (!foundUser) {
    res.status( 404 ).sendData( { error: true, msg: MESSAGES.UNKNOWN_AUTHOR } );
    return;
  }

  // you are on the block list?, can you publish books here?
  const blockedUser = await BlockedPublishers.findOne ({ 'author' : req.auth.userId });
  if (blockedUser) {
    res.status( 403 ).sendData( { error: true, msg: MESSAGES.BLOCKED_PUBLISHER_WARNING } );
    return;
  }

  book.title = fields.title;
  book.description = fields.description;
  book.cover = fields.cover;
  book.price = fields.price;
  book.author = foundUser;

  try {
    const result = await book.save();
    if (result) {
      const book = { 
        id: result._id,
        title: result.title,
        description: result.description,
        cover: result.cover,
        price: result.price,
      };
      return res.status( 200 ).sendData( { msg: MESSAGES.SUCCESS, book } );
    } else {
      res.status( 400 ).sendData( { error: true, msg: MESSAGES.SOMETHING_WRONG } );
    }
  } catch (error) {
    Util.log(error);
    res.status( 400 ).sendData( { error: true, msg: MESSAGES.SOMETHING_WRONG } );
  }
};
const unpublish = async (req, res)  => {
  try {
    if (req.params && req.params.bookId && Book.isValidId(req.params.bookId)) {
      const filter = {_id:req.params.bookId, author: req.auth.userId}; // YOU CAN UNPUBLISH ONLY YOUR BOOKS
      Book.findOneAndDelete(filter, (err, result) => {
        if (err) {
          Util.log(err);
          res.status( 400 ).sendData( { error: true, msg: MESSAGES.SOMETHING_WRONG } );
        } else {
          if (result) {
            res.status( 200 ).sendData( { msg: MESSAGES.SUCCESS_DELETED } );
          } else {
            res.status( 404 ).sendData( { msg: MESSAGES.IS_YOUR_BOOK } );
          }
        }
      });
    } else {
      res.status( 400 ).sendData( { error: true, msg: MESSAGES.UNPUBLISH_BOOK_ERROR } );
    }
  } catch (error) {
    res.status( 400 ).sendData( { error: true, msg: MESSAGES.SOMETHING_WRONG } );
  }
};
module.exports = {
  register,
  update,
  detail,
  publish,
  unpublish,
};