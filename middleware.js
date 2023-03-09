module.exports.isLoggedIn = (req, res, next) => {
	if (!req.isAuthenticated()) {
		req.flash("error", "Please log in first.");
		return res.redirect("/login");
	}
	next();
};
