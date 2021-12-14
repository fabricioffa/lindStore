const Joi = require('joi');

exports.coursePostValidator = (body) => {
  const schema = Joi.object({
    name: Joi.string().trim().min(5).max(255).required(),
    imgSrc: Joi.string().trim().min(5).max(255).required(),
    imgAlt: Joi.string().trim().min(5).max(255).required(),
    description: Joi.string().trim().min(5).max(1200).required(),
    price: Joi.number().min(10).max(3000).positive().precision(2).required(),
  });

  return schema.validate(body, { abortEarly: false });
};

exports.coursePutValidator = (body) => {
  const schema = Joi.object({
    name: Joi.string().trim().min(5).max(255),
    imgSrc: Joi.string().trim().min(5).max(255),
    imgAlt: Joi.string().trim().min(5).max(255),
    description: Joi.string().trim().min(5).max(1200),
    price: Joi.number().min(10).max(3000).positive().precision(2),
  });

  return schema.validate(body, { abortEarly: false });
};

exports.bookPostValidator = (body) => {
  const schema = Joi.object({
    name: Joi.string().trim().min(5).max(255).required(),
    imgSrc: Joi.string().trim().min(5).max(255).required(),
    imgAlt: Joi.string().trim().min(5).max(255).required(),
    description: Joi.string().trim().min(5).max(1200).required(),
    price: Joi.number().min(10).max(3000).positive().precision(2).required(),
    pagesNumber: Joi.number().min(10).max(1200).positive().required(),
  });

  return schema.validate(body, { abortEarly: false });
};

exports.bookPutValidator = (body) => {
  const schema = Joi.object({
    name: Joi.string().trim().min(5).max(255),
    imgSrc: Joi.string().trim().min(5).max(255),
    imgAlt: Joi.string().trim().min(5).max(255),
    description: Joi.string().trim().min(5).max(1200),
    price: Joi.number().min(10).max(3000).positive().precision(2),
    pagesNumber: Joi.number().min(10).max(1200).positive(),
  });

  return schema.validate(body, { abortEarly: false });
};
