const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
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
  description: {
    type: String,
    required: true,
    minLength: 5,
    maxLength: 1200,
    trim: true,
  },
});

const Course = mongoose.model('Course', courseSchema);

module.exports = Course;
