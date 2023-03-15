const express = require("express");
const catchAsync = require("../utils/catchAsync");

const { isLoggedIn, isReviewAuthor, validateReview } = require("../middleware");
const { createReview, deleteReview } = require("../controllers/reviews");

const router = express.Router({ mergeParams: true });

router.post("/", isLoggedIn, validateReview, catchAsync(createReview));

router.delete(
	"/:reviewId",
	isLoggedIn,
	isReviewAuthor,
	catchAsync(deleteReview)
);

module.exports = router;
