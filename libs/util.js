//Return the param x with trim regex applied.
const myTrim = (x) => {
  return x.replace(/^\s+|\s+$/gm,'');
};

const isValidPattern = (text, pattern) => {
  return pattern.test(text);
};

const isValidEmail = (email) => {
  const expresionRegular = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return isValidPattern(email, expresionRegular);
};

const log = (err) => {
  console.log(err);
};
module.exports = { 
  myTrim,
  isValidEmail,
  log,
};
