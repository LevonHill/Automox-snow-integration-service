//Centralize configuration so you don't scatter process.env throughout the application.


require('dotenv').config();

module.exports = {
  app: {
    port: process.env.PORT || 3000
  },

  automox: {
    url: process.env.AUTOMOX_URL,
    apiKey: process.env.AUTOMOX_API_KEY
  },

  serviceNow: {
    url: process.env.SNOW_URL,
    username: process.env.SNOW_USER,
    password: process.env.SNOW_PASSWORD
  },

  logging: {
    level: process.env.LOG_LEVEL || 'info'
  },

  sync: {
    enabled: process.env.SYNC_ENABLED === 'true'
  }
};