'use strict';

const mongoose = require( 'mongoose' );
const app      = require( './app' );
const config   = require( './libs/config');
const port     = config.SERVER_PORT || 8080;
const environment     = config.NODE_ENV || 'local';
const serverMsg = `challenge API listening on port ${port} environment ${environment}`;

const server = app.listen( port, () => {   
  if (config.NODE_ENV !== 'test') {
    mongoose.Promise = global.Promise;
    mongoose.connect( config.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true }, ( error ) => {
      if( error ) {
        throw error;
      }   else {
        console.log( 'Conected to mongodb ...' );
        console.log(serverMsg);
      }
    } );
  } else {
    console.log(serverMsg);
  }
});

module.exports = { server } ;

