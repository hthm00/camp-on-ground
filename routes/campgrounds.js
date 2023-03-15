const express = require("express");
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
} = require("../controllers/campgrounds");

const router = express.Router();

router
	.route("/")
	.get(catchAsync(renderAllCampgrounds))
	.post(isLoggedIn, validateCampground, catchAsync(createCampground));

router.get("/new", isLoggedIn, renderNewForm);

router.get("/:id", catchAsync(renderCamground));

router
	.route("/:id")
	.put(
		isLoggedIn,
		isCamgroundAuthor,
		validateCampground,
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
