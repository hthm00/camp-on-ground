const express = require("express");
const catchAsync = require("../utils/catchAsync");
const Campground = require("../models/campground");
const {
	isLoggedIn,
	isCamgroundAuthor,
	validateCampground,
} = require("../middleware");

const router = express.Router();

router.get(
	"/",
	catchAsync(async (req, res) => {
		const campgrounds = await Campground.find({});
		res.render("campgrounds/index", { campgrounds });
	})
);

router.get("/new", isLoggedIn, (req, res) => {
	res.render("campgrounds/new");
});

router.post(
	"/",
	isLoggedIn,
	validateCampground,
	catchAsync(async (req, res) => {
		const campground = new Campground({
			...req.body.campground,
			author: req.user,
		});
		await campground.save();
		req.flash("success", "Add Success!");
		res.redirect(`/campgrounds/${campground._id}`);
	})
);

router.get(
	"/:id",
	catchAsync(async (req, res) => {
		const campground = await Campground.findById(req.params.id).populate(
			"reviews author"
		);
		if (!campground) {
			req.flash("error", "Does Not Exist!");
			return res.redirect("/campgrounds");
		}
		res.render("campgrounds/show", { campground });
	})
);

router.get(
	"/:id/edit",
	isLoggedIn,
	isCamgroundAuthor,
	catchAsync(async (req, res) => {
		const campground = await Campground.findById(req.params.id).populate(
			"author"
		);
		if (!campground) {
			req.flash("error", "Does Not Exist!");
			return res.redirect("/campgrounds");
		}
		res.render("campgrounds/edit", { campground });
	})
);

router.put(
	"/:id",
	isLoggedIn,
	isCamgroundAuthor,
	validateCampground,
	catchAsync(async (req, res) => {
		const { id } = req.params;
		const campground = await Campground.findByIdAndUpdate(id, {
			...req.body.campground,
		});
		req.flash("success", "Update Success!");
		res.redirect(`/campgrounds/${campground._id}`);
	})
);

router.delete(
	"/:id",
	isLoggedIn,
	isCamgroundAuthor,
	catchAsync(async (req, res) => {
		const { id } = req.params;
		await Campground.findByIdAndDelete(id);
		req.flash("success", "Delete Success!");
		res.redirect("/campgrounds");
	})
);

module.exports = router;
