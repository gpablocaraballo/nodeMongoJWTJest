const dotenv = require('dotenv');
dotenv.config();

const config = {
  JWT_PASSPHRASE: process.env.JWT_PASSPHRASE,
  MONGODB_URI: process.env.MONGODB_URI,
  MONGODB_URI_TEST: process.env.MONGODB_URI_TEST,
  SERVER_PORT: process.env.SERVER_PORT,
  NODE_ENV: process.env.NODE_ENV,
  NODEMAILER_USERNAME: process.env.NODEMAILER_USERNAME,
  NODEMAILER_PWD: process.env.NODEMAILER_PWD,
};
module.exports = config;
