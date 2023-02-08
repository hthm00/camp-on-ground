const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const reviewSchema = Schema({
	rating: {
		type: Number,
		required: true,
	},
	review: {
		type: String,
		required: true,
	},
});

const reviewModel = mongoose.model("Review", reviewSchema);

module.exports = reviewModel;
