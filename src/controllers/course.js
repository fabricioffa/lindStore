const Course = require('../models/Course');
const { coursePostValidator: postValidator, coursePutValidator: putValidator } = require('../utils/validators');
const mongoose = require('mongoose');

exports.index = async (req, res) => {
  const courses = await Course.find({});

  if (!courses.length) return res.status(404).send(courses);

  res.send(courses);
};

exports.register = async (req, res) => {
  const courseInDb = await Course.findOne({ name: req.body.name });
  if (courseInDb) return res.status(400).send('Course already exists');

  const course = await Course.create(req.body);

  res.send(course);
};

exports.edit = async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).send('Invalid id format.');

  const course = await Course.findById(req.params.id);
  if (!course) return res.status(404).send('Id does not matches any course.');

  res.send(course);
};

exports.delete = async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).send('Invalid id format.');

  const course = await Course.findById(req.params.id);
  if (!course) return res.status(404).send('Id does not matches any course.');

  await Course.findByIdAndDelete(req.params.id);
  res.send(course);
};

exports.getOne = async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).send('Invalid id format.');

  const course = await Course.findById(req.params.id);
  if (!course) return res.status(404).send('Id does not matches any course.');

  res.send(course);
};
