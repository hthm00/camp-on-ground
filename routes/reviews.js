const express = require("express");
const catchAsync = require("../utils/catchAsync");
const Campground = require("../models/campground");
const Review = require("../models/review");
const ExpressError = require("../utils/ExpressError");
const { reviewSchema } = require("../schemas");

const router = express.Router({ mergeParams: true });

const validateReview = (req, res, next) => {
	const result = reviewSchema.validate(req.body);
	if (result.error) {
		throw new ExpressError(result.error.details[0].message, 400);
	} else {
		next();
	}
};

router.post(
	"/",
	validateReview,
	catchAsync(async (req, res) => {
		const { id } = req.params;
		const review = new Review(req.body.review);
		await Campground.findByIdAndUpdate(id, {
			$push: { reviews: review },
		});
		await review.save();
		res.redirect(`/campgrounds/${id}`);
	})
);

router.delete(
	"/:reviewId",
	catchAsync(async (req, res) => {
		const { id, reviewId } = req.params;
		const review = await Review.findByIdAndDelete(reviewId);
		await Campground.findByIdAndUpdate(id, {
			$pull: { reviews: review._id },
		});
		res.redirect(`/campgrounds/${id}`);
	})
);

module.exports = router;
