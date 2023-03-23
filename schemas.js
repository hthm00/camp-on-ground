const Joi = require("joi");

module.exports.campgroundSchema = Joi.object({
	campground: Joi.object({
		title: Joi.string().required(),
		// images: Joi.array().required(),
		price: Joi.number().min(0),
		location: Joi.string().required(),
		description: Joi.string().required(),
	}).required(),
});

module.exports.reviewSchema = Joi.object({
	review: Joi.object({
		rating: Joi.number().min(1).max(5).required(),
		review: Joi.string().required(),
	}).required(),
});
