require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const app = express();

process.on('uncaughtException', (err) => {
  console.error('uncaughtException:\n', err);
  process.exit(1);
});

process.on('unhandledRejection', (err) => {
  console.error('unhandledRejection:\n', err);
  process.exit(1);
});

mongoose
  .connect(process.env.CONNECTION_STRING)
  .then(() => app.emit('connected'))
  .catch((err) => console.error('Connection error:\n', err));

const sessionOptions = session({
  secret: process.env.SESSION_SECRET,
  store: MongoStore.create({ mongoUrl: process.env.CONNECTION_STRING }),
  resave: false,
  saveUninitialized: false,
});

app.use(sessionOptions);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const port = process.env.PORT || 3333;

app.on('connected', () => {
  app.listen(port, () => console.log(`Listening on port ${port}`));
});
