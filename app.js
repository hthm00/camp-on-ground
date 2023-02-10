const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate");
const session = require("express-session");
const flash = require("connect-flash");
const ExpressError = require("./utils/ExpressError");
const methodOverride = require("method-override");
const campgrounds = require("./routes/campgrounds");
const reviews = require("./routes/reviews");

mongoose.connect("mongodb://localhost:27017/yelp-camp", {
	useNewUrlParser: true,
	useCreateIndex: true,
	useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
	console.log("Database connected");
});

const app = express();

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

const sessOptions = {
	secret: "this is a sample secret",
	resave: false,
	saveUninitialized: true,
	cookie: {
		maxAge: 7 * 24 * 3600 * 1000,
	},
};

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));
app.use(session(sessOptions));
app.use(flash());

app.use((req, res, next) => {
	res.locals.success = req.flash("success");
	res.locals.error = req.flash("error");
	next();
});

app.get("/", (req, res) => {
	res.render("home");
});

app.use("/campgrounds", campgrounds);
app.use("/campgrounds/:id/reviews", reviews);

app.all("*", (req, res, next) => {
	next(new ExpressError("Page not found!", 404));
});

/* Middleware to show error page */
app.use((err, req, res, next) => {
	if (!err.message) err.message = "Something went wrong!";
	if (!err.statusCode) err.statusCode = 500;
	console.log(err);
	res.status(err.statusCode).render("error", { err });
});

app.listen(3000, () => {
	console.log("Serving on port 3000");
});
