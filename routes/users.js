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
		failureFlash: true,
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
			req.flash("success", "Register Completed. Please Login!");
			res.redirect("/login");
		} catch (err) {
			console.log(err);
			req.flash("error", err.message);
			res.redirect("/register");
		}
	})
);

router.get("/logout", (req, res) => {
	req.logOut((e) => {
		if (e) {
			console.log("Error logging out");
			res.redirect("/");
		} else {
			res.redirect("/campgrounds");
		}
	});
});

module.exports = router;
