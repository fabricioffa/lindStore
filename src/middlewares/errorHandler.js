module.exports = (err, res) => {
  console.error('ErrorHandler caught an error:\n', err);
  if (err) return res.status(500).send('Something ocurred');
};
