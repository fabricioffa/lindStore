module.exports = (fn) => {
  return (req, res, next) => {
    try {
      fn(req, res);
    } catch (err) {
      next(err, res);
    }
  };
};
