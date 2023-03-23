if (process.env.NODE_ENV !== "production") {
	require("dotenv").config();
}
const express = require("express");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
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

// Configuration
cloudinary.config({
	cloud_name: process.env.CLOUDINARY_NAME,
	api_key: process.env.CLOUDINARY_KEY,
	api_secret: process.env.CLOUDINARY_SECRET,
});

const storage = new CloudinaryStorage({
	cloudinary: cloudinary,
	params: {
		folder: "CampOnGround",
		allowed_formats: ["png", "jpeg", "jpg"],
	},
});

const upload = multer({ storage: storage });

const router = express.Router();

router
	.route("/")
	.get(catchAsync(renderAllCampgrounds))
	.post(
		isLoggedIn,
		upload.array("campground[images]"),
		validateCampground,
		catchAsync(createCampground)
	);

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
