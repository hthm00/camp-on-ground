const express = require("express");
const { upload } = require("../cloudinary");
const catchAsync = require("../utils/catchAsync");
const {
	isLoggedIn,
	isCamgroundAuthor,
	validateCampground,
} = require("../middleware");

const {
	renderAllCampgrounds,
	renderNewForm,
	createCampground,
	renderCamground,
	renderEditCampground,
	updateCampground,
	deleteCampground,
	geoFetch,
} = require("../controllers/campgrounds");

const router = express.Router();

router
	.route("/")
	.get(catchAsync(renderAllCampgrounds))
	.post(
		isLoggedIn,
		upload.array("campground[images]"),
		validateCampground,
		geoFetch,
		catchAsync(createCampground)
	);

router.get("/new", isLoggedIn, renderNewForm);

router.get("/:id", catchAsync(renderCamground));

router
	.route("/:id")
	.put(
		isLoggedIn,
		isCamgroundAuthor,
		upload.array("campground[images]"),
		validateCampground,
		geoFetch,
		catchAsync(updateCampground)
	)
	.delete(isLoggedIn, isCamgroundAuthor, catchAsync(deleteCampground));

router.get(
	"/:id/edit",
	isLoggedIn,
	isCamgroundAuthor,
	catchAsync(renderEditCampground)
);

module.exports = router;
