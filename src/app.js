//only express
const express = require('express');
const syncRoutes = require('./routes/syncRoutes');
const config = require('../config/config');


console.log(config.serviceNow.url);

const app = express();

app.use(express.json());
app.use('/sync', syncRoutes);

module.exports = app;