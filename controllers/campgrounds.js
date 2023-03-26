const Campground = require("../models/campground");

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
	req.flash("success", "Update Success!");
	res.redirect(`/campgrounds/${campground._id}`);
};

module.exports.deleteCampground = async (req, res) => {
	const { id } = req.params;
	await Campground.findByIdAndDelete(id);
	req.flash("success", "Delete Success!");
	res.redirect("/campgrounds");
};
