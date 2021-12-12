const session = require('express-session');
const MongoStore = require('connect-mongo');
const routes = require('../routes');
const errorHandler = require('../src/middlewares/errorHandler');

const uri =
  process.env.NODE_ENV === 'test' ? 'mongodb://localhost:27017/lindStore_tests' : process.env.CONNECTION_STRING;

module.exports = (express, app, conn) => {
  const sessionOptions = session({
    secret: process.env.SESSION_SECRET,
    store: MongoStore.create(conn),
    resave: false,
    saveUninitialized: false,
  });

  app.use(sessionOptions);
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(routes);
  app.use(errorHandler);
};
