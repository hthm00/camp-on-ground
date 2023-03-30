const mongoose = require("mongoose");
const cities = require("./cities");
const { places, descriptors } = require("./seedHelpers");
const Campground = require("../models/campground");

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

const sample = (array) => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
	await Campground.deleteMany({});
	for (let i = 0; i < 50; i++) {
		const random1000 = Math.floor(Math.random() * 1000);
		const randomPrice = Math.floor(Math.random() * 10) + 30;
		const camp = new Campground({
			author: "640c15edb3a4cd59650093e9",
			geometry: {
				type: "Point",
				coordinates: [
					cities[random1000].longitude,
					cities[random1000].latitude,
				],
			},
			location: `${cities[random1000].city}, ${cities[random1000].state}`,
			title: `${sample(descriptors)} ${sample(places)}`,
			images: [
				{
					fileName: "CampOnGround/gpmn48vu2wxsvdscgsyi",
					path: "https://res.cloudinary.com/dwl8dexri/image/upload/v1679530201/CampOnGround/gu59en42z59vysahxmg9.jpg",
				},
				{
					fileName: "CampOnGround/c1d3qirwohlw729jt1pq",
					path: "https://res.cloudinary.com/dwl8dexri/image/upload/v1679530202/CampOnGround/bquy2cctkbxn8kakp0qo.jpg",
				},
			],
			description:
				"Lorem ipsum dolor sit amet consectetur adipisicing elit. Amet quas cupiditate consectetur aspernatur, corrupti ex ducimus ut explicabo in minus vero magnam nostrum sunt quos, pariatur quidem, eveniet quam consequuntur!",
			price: randomPrice,
		});
		await camp.save();
	}
};

seedDB().then(() => {
	mongoose.connection.close();
});
