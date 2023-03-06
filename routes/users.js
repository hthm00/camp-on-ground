const express = require("express");
const User = require("../models/user");
const passport = require("passport");
const catchAsync = require("../utils/catchAsync");

const router = express.Router();

router.get("/login", (req, res) => {
	res.render("users/login");
});

router.post(
	"/login",
	passport.authenticate("local", {
		failureRedirect: "/login",
		failureMessage: true,
	}),
	async (req, res) => {
		req.flash("success", "Welcome Back!");
		res.redirect("/campgrounds");
	}
);

router.get("/register", (req, res) => {
	res.render("users/register");
});

router.post(
	"/register",
	catchAsync(async (req, res) => {
		const { email, username, password } = req.body;
		const newUser = new User({
			email: email,
			username: username,
		});
		try {
			await User.register(newUser, password);
			// await newUser.setPassword(password);
			// await newUser.save();
			req.flash("success", "Register Completed. Please Login!");
			res.redirect("/login");
		} catch (err) {
			console.log(err);
			req.flash("error", err.message);
			res.redirect("/register");
		}
	})
);

module.exports = router;
