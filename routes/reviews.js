const express = require("express");
const catchAsync = require("../utils/catchAsync");
const Campground = require("../models/campground");
const Review = require("../models/review");
const { isLoggedIn, isReviewAuthor, validateReview } = require("../middleware");

const router = express.Router({ mergeParams: true });

router.post(
	"/",
	isLoggedIn,
	validateReview,
	catchAsync(async (req, res) => {
		const { id } = req.params;
		const review = new Review({ ...req.body.review, author: req.user });
		await Campground.findByIdAndUpdate(id, {
			$push: { reviews: review },
		});
		await review.save();
		req.flash("success", "Review Posted!");
		res.redirect(`/campgrounds/${id}`);
	})
);

router.delete(
	"/:reviewId",
	isLoggedIn,
	isReviewAuthor,
	catchAsync(async (req, res) => {
		const { id, reviewId } = req.params;
		const review = await Review.findByIdAndDelete(reviewId);
		await Campground.findByIdAndUpdate(id, {
			$pull: { reviews: review._id },
		});
		req.flash("success", "Review Deleted!");
		res.redirect(`/campgrounds/${id}`);
	})
);

module.exports = router;
