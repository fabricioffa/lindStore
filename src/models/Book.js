const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minLength: 5,
    maxLength: 255,
    trim: true,
  },
  imgSrc: {
    type: String,
    required: true,
    minLength: 5,
    maxLength: 255,
    trim: true,
  },
  imgAlt: {
    type: String,
    required: true,
    minLength: 5,
    maxLength: 255,
    trim: true,
  },
  price: {
    type: Number,
    required: true,
    min: 10,
    max: 3000,
  },
  pagesNumber: {
    type: Number,
    required: true,
    min: 10,
    max: 3000,
  },
  description: {
    type: String,
    required: true,
    minLength: 5,
    maxLength: 1200,
    trim: true,
  },
});

const Book = mongoose.model('Book', bookSchema);

module.exports = Book;
