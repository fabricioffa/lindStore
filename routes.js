const router = require('express').Router();
const course = require('./src/controllers/course');
const applyTryAndCatch = require('./src/middlewares/applyTryAndCatch');

router.get('/api/courses', applyTryAndCatch(course.index));
router.post('/api/courses', applyTryAndCatch(course.register));
router.put('/api/courses/:id', applyTryAndCatch(course.edit));
router.delete('/api/courses/:id', applyTryAndCatch(course.delete));
router.get('/api/courses/:id', applyTryAndCatch(course.getOne));

module.exports = router;
