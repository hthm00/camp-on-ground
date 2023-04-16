const BaseJoi = require("joi");
const SanitizeHtml = require("sanitize-html");

const Joi = BaseJoi.extend((joi) => {
	return {
		type: "string",
		base: joi.string(),
		rules: {
			htmlStrip: {
				validate(value) {
					return SanitizeHtml(value, {
						allowedTags: [],
						allowedAttributes: {},
					});
				},
			},
		},
	};
});

module.exports.campgroundSchema = Joi.object({
	campground: Joi.object({
		title: Joi.string().htmlStrip().required(),
		// images: Joi.array().required(),
		price: Joi.number().min(0),
		location: Joi.string().htmlStrip().required(),
		description: Joi.string().htmlStrip().required(),
	}).required(),
	deleteImages: Joi.array(),
});

module.exports.reviewSchema = Joi.object({
	review: Joi.object({
		rating: Joi.number().min(1).max(5).required(),
		review: Joi.string().htmlStrip().required(),
	}).required(),
});
