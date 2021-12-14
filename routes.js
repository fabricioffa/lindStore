const router = require('express').Router();

const course = require('./src/controllers/course');
const book = require('./src/controllers/book');

const applyTryAndCatch = require('./src/middlewares/applyTryAndCatch');
const validateWith = require('./src/middlewares/validateWith');

const {
  coursePostValidator,
  coursePutValidator,
  bookPostValidator,
  bookPutValidator,
} = require('./src/utils/validators');

router.get('/api/courses', applyTryAndCatch(course.index));
router.post('/api/courses', validateWith(coursePostValidator), applyTryAndCatch(course.register));
router.put('/api/courses/:id', validateWith(coursePutValidator), applyTryAndCatch(course.edit));
router.delete('/api/courses/:id', applyTryAndCatch(course.delete));
router.get('/api/courses/:id', applyTryAndCatch(course.getOne));

router.get('/api/books', applyTryAndCatch(book.index));
router.post('/api/books', validateWith(bookPostValidator), applyTryAndCatch(book.register));
router.put('/api/books/:id', validateWith(bookPutValidator), applyTryAndCatch(book.edit));
router.delete('/api/books/:id', applyTryAndCatch(book.delete));
router.get('/api/books/:id', applyTryAndCatch(book.getOne));

module.exports = router;
