const mongoose = require('mongoose');

module.exports = (app) => {
  const uri =
    process.env.NODE_ENV === 'test' ? 'mongodb://localhost:27017/lindStore_tests' : process.env.CONNECTION_STRING;

  mongoose
    .connect(uri)
    .then(() => {
      console.log('Successfully connected!');
      app.emit('connected');
    })
    .catch((err) => console.error('Connection error:\n', err));
};
