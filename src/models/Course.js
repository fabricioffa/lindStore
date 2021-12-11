const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minLength: 5,
    maxlength: 255,
    trim: true,
    unique: true,
  },
  imgSrc: {
    type: String,
    required: true,
    trim: true,
  },
  imgAlt: {
    type: String,
    required: true,
    trim: true,
  },
  price: {
    type: Number,
    required: true,
    min: 10,
    max: 3000,
  },
});

const Course = mongoose.model('Course', courseSchema);

module.exports = Course;
