const Campground = require("./models/campground");
const Review = require("./models/review");
const ExpressError = require("./utils/ExpressError");
const { campgroundSchema, reviewSchema } = require("./schemas");

module.exports.isLoggedIn = (req, res, next) => {
	if (!req.isAuthenticated()) {
		req.flash("error", "Please log in first.");
		return res.redirect("/login");
	}
	next();
};

module.exports.isCamgroundAuthor = async (req, res, next) => {
	const campground = await Campground.findById(req.params.id).populate(
		"author"
	);
	if (!campground.author.equals(req.user)) {
		req.flash("error", "You don't have permission.");
		return res.redirect("/campgrounds");
	}
	next();
};

module.exports.validateCampground = (req, res, next) => {
	const result = campgroundSchema.validate(req.body);
	if (result.error) {
		throw new ExpressError(result.error.details[0].message, 400);
	} else {
		next();
	}
};

module.exports.isReviewAuthor = async (req, res, next) => {
	const { id, reviewId } = req.params;
	const review = await Review.findById(reviewId).populate("author");
	if (!review.author.equals(req.user)) {
		req.flash("error", "You don't have permission.");
		return res.redirect(`/campgrounds/${id}`);
	}
	next();
};

module.exports.validateReview = (req, res, next) => {
	const result = reviewSchema.validate(req.body);
	if (result.error) {
		throw new ExpressError(result.error.details[0].message, 400);
	} else {
		next();
	}
};
