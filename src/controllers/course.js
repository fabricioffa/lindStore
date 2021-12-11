const Course = require('../models/Course');
const { coursePostValidator: postValidator } = require('../utils/validators');

exports.index = async (req, res) => {
  const courses = await Course.find({});

  if (!courses.length) return res.status(404).send(courses);

  res.send(courses);
};

exports.register = async (req, res) => {
  const { error } = postValidator(req.body);

  if (error) {
    let errors = 'Atention!\n';
    for (const detail of error.details) {
      errors = `${errors + detail.message}\n`;
    }
    return res.status(400).send(errors);
  }

  const course = await Course.findOne({ name: req.body.name });
  if (course) return res.status(400).send('Course already exists');

  res.send('Deu');
};
