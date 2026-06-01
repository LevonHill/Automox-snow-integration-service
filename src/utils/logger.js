const timestamp = () => {
  return new Date().toISOString();
};

module.exports = {
  info(message) {
    console.log(`[INFO] ${timestamp()} - ${message}`);
  },

  warn(message) {
    console.warn(`[WARN] ${timestamp()} - ${message}`);
  },

  error(message) {
    console.error(`[ERROR] ${timestamp()} - ${message}`);
  }
};

//For a small project, start simple.



//usage For a small project, start simple “print stuff in a clean way”.

// const logger = require('../utils/logger');
//logger.info('Starting Automox sync');Why this is useful

//Later you can upgrade it to:

//write to a file
//send logs to Splunk / Datadog
//add timestamps
//add request IDs

//Without changing any other file.