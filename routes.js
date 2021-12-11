const router = require('express').Router();
const course = require('./src/controllers/course');

router.get('/api/courses', course.index);
router.post('/api/courses', course.register);

module.exports = router;
