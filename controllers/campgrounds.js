const { cloudinary } = require("../cloudinary");
const Campground = require("../models/campground");
const geocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const geocodingClient = geocoding({
	accessToken: process.env.MAPBOX_TOKEN,
});

module.exports.renderAllCampgrounds = async (req, res) => {
	const campgrounds = await Campground.find({});
	res.render("campgrounds/index", { campgrounds });
};

module.exports.renderNewForm = (req, res) => {
	res.render("campgrounds/new");
};

module.exports.createCampground = async (req, res) => {
	const files = req.files.map((f) => ({ fileName: f.filename, path: f.path }));
	const campground = new Campground({
		...req.body.campground,
		images: files,
		author: req.user,
	});
	await campground.save();
	req.flash("success", "Add Success!");
	res.redirect(`/campgrounds/${campground._id}`);
};

module.exports.renderCamground = async (req, res) => {
	const campground = await Campground.findById(req.params.id)
		.populate("author")
		.populate({
			path: "reviews",
			populate: { path: "author" },
		});
	if (!campground) {
		req.flash("error", "Does Not Exist!");
		return res.redirect("/campgrounds");
	}
	res.render("campgrounds/show", { campground });
};

module.exports.renderEditCampground = async (req, res) => {
	const campground = await Campground.findById(req.params.id).populate(
		"author"
	);
	if (!campground) {
		req.flash("error", "Does Not Exist!");
		return res.redirect("/campgrounds");
	}
	res.render("campgrounds/edit", { campground });
};

module.exports.updateCampground = async (req, res) => {
	const { id } = req.params;
	const files = req.files.map((f) => ({ fileName: f.filename, path: f.path }));
	const campground = await Campground.findById(id);
	await campground.updateOne({
		...req.body.campground,
		$push: { images: files },
	});
	await campground.updateOne({
		$pull: { images: { fileName: { $in: req.body.deleteImages } } },
	});
	if (req.body.deleteImages) {
		for (const img of req.body.deleteImages) {
			await cloudinary.uploader.destroy(img);
		}
	}
	req.flash("success", "Update Success!");
	res.redirect(`/campgrounds/${campground._id}`);
};

module.exports.deleteCampground = async (req, res) => {
	const { id } = req.params;
	await Campground.findByIdAndDelete(id);
	req.flash("success", "Delete Success!");
	res.redirect("/campgrounds");
};

module.exports.geoFetch = async (req, res, next) => {
	const { location } = req.body.campground;
	const geoData = await geocodingClient
		.forwardGeocode({
			query: location,
			limit: 1,
		})
		.send();
	let geometry = { type: "Point", coordinates: [-122.330062, 47.603832] };
	if (geoData && geoData.body.features) {
		if ((feature = geoData.body.features[0])) {
			geometry = feature.geometry;
		}
	}
	req.body.campground.geometry = geometry;
	next();
};
