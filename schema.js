const Joi = require("joi");

module.export.campgroundSchema = Joi.object({
  //server side validation
  campground: Joi.object({
    title: Joi.string().required(),
    price: Joi.number().required().min(0),
    image: Joi.string().required(),
    location: Joi.string().required(),
    description: Joi.string().required(),
  }).required(),
});
