const User = require("../models/user");

module.exports.renderLogin = (req, res) => {
	res.render("users/login");
};

module.exports.loginUser = async (req, res) => {
	req.flash("success", "Welcome Back!");
	res.redirect("/campgrounds");
};

module.exports.renderRegister = (req, res) => {
	res.render("users/register");
};

module.exports.createUser = async (req, res) => {
	const { email, username, password } = req.body;
	const newUser = new User({
		email: email,
		username: username,
	});
	try {
		await User.register(newUser, password);
		req.flash("success", "Register Completed. Please Login!");
		res.redirect("/login");
	} catch (err) {
		console.log(err);
		req.flash("error", err.message);
		res.redirect("/register");
	}
};

module.exports.logoutUser = (req, res) => {
	req.logOut((e) => {
		if (e) {
			console.log("Error logging out");
			res.redirect("/");
		} else {
			res.redirect("/campgrounds");
		}
	});
};
