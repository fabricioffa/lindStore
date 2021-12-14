module.exports = (validator) => {
  return (req, res, next) => {
    const { error } = validator(req.body);

    if (error) {
      let errors = 'Attention!\n';
      for (const detail of error.details) {
        errors = `${errors + detail.message}\n`;
      }
      return res.status(400).send(errors);
    }

    next();
  };
};
