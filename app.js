if (process.env.NODE_ENV !== "production") {
	require("dotenv").config();
}

const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const helmet = require("helmet");

const ExpressError = require("./utils/ExpressError");
const methodOverride = require("method-override");
const campgroundRoutes = require("./routes/campgrounds");
const reviewRoutes = require("./routes/reviews");
const userRoutes = require("./routes/users");

const User = require("./models/user");

const dbURL = process.env.DB_URL || "mongodb://localhost:27017/yelp-camp";
mongoose.connect(dbURL, {
	useNewUrlParser: true,
	useCreateIndex: true,
	useUnifiedTopology: true,
	useFindAndModify: false,
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

const secret = process.env.SECRET || "this is a sample secret";
const store = MongoStore.create({
	mongoUrl: dbURL,
	touchAfter: 24 * 3600,
	secret,
});
const sessOptions = {
	store,
	secret,
	name: "session_id",
	resave: false,
	saveUninitialized: true,
	cookie: {
		httpOnly: true,
		secure: process.env.NODE_EVN === "production",
		maxAge: 7 * 24 * 3600 * 1000,
	},
};

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));
app.use(session(sessOptions));
app.use(flash());
app.use(helmet());
const scriptSrcUrls = [
	"https://stackpath.bootstrapcdn.com/",
	"https://api.tiles.mapbox.com/",
	"https://api.mapbox.com/",
	"https://kit.fontawesome.com/",
	"https://cdnjs.cloudflare.com/",
	"https://cdn.jsdelivr.net",
];
const styleSrcUrls = [
	"https://kit-free.fontawesome.com/",
	"https://stackpath.bootstrapcdn.com/",
	"https://api.mapbox.com/",
	"https://api.tiles.mapbox.com/",
	"https://fonts.googleapis.com/",
	"https://use.fontawesome.com/",
	"https://cdn.jsdelivr.net",
];
const connectSrcUrls = [
	"https://api.mapbox.com/",
	"https://a.tiles.mapbox.com/",
	"https://b.tiles.mapbox.com/",
	"https://events.mapbox.com/",
];
const fontSrcUrls = [];
app.use(
	helmet.contentSecurityPolicy({
		directives: {
			defaultSrc: [],
			connectSrc: ["'self'", ...connectSrcUrls],
			scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
			styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
			workerSrc: ["'self'", "blob:"],
			objectSrc: [],
			imgSrc: [
				"'self'",
				"blob:",
				"data:",
				"https://res.cloudinary.com/dwl8dexri/",
				"https://images.unsplash.com/",
				"https://images.pexels.com",
			],
			fontSrc: ["'self'", ...fontSrcUrls],
		},
	})
);

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
	res.locals.user = req.user;
	res.locals.success = req.flash("success");
	res.locals.error = req.flash("error");
	next();
});

app.get("/", (req, res) => {
	res.render("home");
});

app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/reviews", reviewRoutes);
app.use("/", userRoutes);

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

const port = process.env.PORT || 3001;
app.listen(port, () => {
	console.log(`Serving on port ${port}`);
});
