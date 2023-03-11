const Campground = require("./models/campground");
const ExpressError = require("./utils/ExpressError");
const { campgroundSchema } = require("./schemas");

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
