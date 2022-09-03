/**
 * type 0 - info
 * type 1 - warn
 * type 2 - error
 */

function log(message, type, app = 0) {
  let pref;

  switch (type) {
    case 0:
      pref = "dev";
      break;
    case 1:
      pref = "warm";
      break;
    case 2:
      pref = "error";
      break;
    default:
      pref = "info";
      break;
  }
  if ((type == 0 && process.env.ENVIRONMENT == "dev") || type > 0) {
    console.log(`${pref}: ${message}`);
  }
}

module.exports = {
  log,
};
