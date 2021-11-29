'use strict';
const Book   = require( '../models/book' );
const { MESSAGES } = require( '../libs/constants' );

/***********************************************************************************
****************** Functions invoked when passing routes ***************************
************************************************************************************/
const list = async (req, res)  => {
  let filter = {};
  if (req.query && req.query.q) {
    const re = new RegExp(req.query.q.toLowerCase(), 'i');
    filter = { $or: [ { title: re }, { description: re } ] };
  }
  Book.find(filter, ( err, storage ) => {
    if( err ) { 
      res.status( 500 ).sendData( { error: true, msg: MESSAGES.ERROR_GETTING_BOOKS } ); 
    }
    else {
      if(!storage ) { 
        res.status( 400 ).sendData( { error: true, msg: MESSAGES.NO_BOOK_STORAGE } ); 
      }
      else {
        res.status( 200 ).sendData( { books: storage } );
      }
    }
  });
};
const detail = async (req, res)  => {
  if (req.query && req.query.id && Book.isValidId(req.query.id)) {
    const foundBook = await Book.findOne ({ '_id' : req.query.id });
    if (!foundBook) {
      res.status( 404 ).sendData( { error: true, msg: MESSAGES.UNKNOWN_BOOK } );
      return;         
    }
    res.status( 200 ).sendData( { book: foundBook } );
  } else {
    res.status( 400 ).sendData( { error: true, msg: MESSAGES.SOMETHING_WRONG } );
  }
};

module.exports = {
  list,
  detail,
};