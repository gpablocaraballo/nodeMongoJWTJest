//Return the param x with trim regex applied.
const myTrim = (x) => {
  return x.replace(/^\s+|\s+$/gm,'');
};
const log = (err) => {
  console.log(err);
};
module.exports = { 
  myTrim,
  log,
};
