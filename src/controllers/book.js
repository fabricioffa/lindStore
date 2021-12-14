const Book = require('../models/Book');
// const { bookPostValidator: postValidator, bookPutValidator: putValidator } = require('../utils/validators');
const mongoose = require('mongoose');

exports.index = async (req, res) => {
  const books = await Book.find({});

  if (!books.length) return res.status(404).send(books);

  res.send(books);
};

exports.register = async (req, res) => {
  const bookInDb = await Book.findOne({ name: req.body.name });
  if (bookInDb) return res.status(400).send('Book already exists');

  const book = await Book.create(req.body);

  res.send(book);
};

exports.edit = async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).send('Invalid id format.');

  const book = await Book.findById(req.params.id);
  if (!book) return res.status(404).send('Id does not matches any books.');

  res.send(book);
};

exports.delete = async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).send('Invalid id format.');

  const book = await Book.findById(req.params.id);
  if (!book) return res.status(404).send('Id does not matches any book.');

  await Book.findByIdAndDelete(req.params.id);
  res.send(book);
};

exports.getOne = async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).send('Invalid id format.');

  const book = await Book.findById(req.params.id);
  if (!book) return res.status(404).send('Id does not matches any book.');

  res.send(book);
};
