require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const app = express();

require('./startUp/loggings')();
require('./startup/db')(app);
require('./startup/applications')(express, app);

const port = process.env.PORT || 3333;

if (process.env.NODE_ENV !== 'test') {
  app.on('connected', () => {
    app.listen(port, () => console.log(`Listening on port ${port}`));
  });
}

module.exports = { app, conn: mongoose.connection };
