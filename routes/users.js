const express = require("express");
const passport = require("passport");
const catchAsync = require("../utils/catchAsync");
const {
	renderLogin,
	loginUser,
	renderRegister,
	createUser,
	logoutUser,
} = require("../controllers/users");

const router = express.Router();

router
	.route("/login")
	.get(renderLogin)
	.post(
		passport.authenticate("local", {
			failureRedirect: "/login",
			failureFlash: true,
		}),
		loginUser
	);

router.route("/register").get(renderRegister).post(catchAsync(createUser));

router.get("/logout", logoutUser);

module.exports = router;
