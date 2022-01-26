'use strict';
const express     = require( 'express');
const bodyParser  = require( 'body-parser');
const convert = require('xml-js');
const booksEndpoints  = require( './routes/book' );
const usersEndpoints  = require( './routes/user' );
const authEndpoints  = require( './routes/auth' );
const adminEndpoints  = require( './routes/admin' );
const emailEndpoints  = require( './routes/email' );
const app = express();

app.use( bodyParser.urlencoded( { extended:false } ) );
app.use( bodyParser.json() );

// Config HTTP headers
app.use( ( req, res, next ) => {
  res.header( 'Access-Control-Allow-Origin' , '*' );
  res.header( 'Access-Control-Allow-Headers', 'Cookie, Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method' );
  res.header( 'Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS' );
  res.header( 'Allow', 'GET, POST, PUT, DELETE, OPTIONS' );
  res.sendData = (obj) => {
    /* 
        if we use "Content-Type" "text/xml" or "application/xml" then on POSTMAN on post verb 
        we can not use the body payload application/x-www-form-urlencoded.
        That why i use "accept" text/xml or "accept" application/xml instead.
      */  
    if (req.headers['accept'] && (req.headers['accept'] === 'text/xml' || req.headers['accept'] === 'application/xml')) {
      res.header('Content-Type', 'text/xml');
      const options = {compact: true, ignoreComment: true, spaces: 4};
      const xml = convert.json2xml(obj, options);
      res.send(xml);
    } else {
      res.header('Content-Type', 'application/json');
      res.send(obj);
    }
  };    
  next();
} );

// routes
app.use('/book', booksEndpoints);
app.use('/user', usersEndpoints);
app.use('/auth', authEndpoints);
app.use('/admin', adminEndpoints);
app.use('/email', emailEndpoints);
module.exports = app;
