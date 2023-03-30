const mongoose = require("mongoose");
const Review = require("./review");
const Schema = mongoose.Schema;

const opts = { toJSON: { virtuals: true } };

const CampgroundSchema = new Schema(
	{
		title: String,
		images: [
			{
				fileName: String,
				path: String,
			},
		],
		price: Number,
		description: String,
		location: String,
		geometry: {
			type: {
				type: String,
				enum: ["Point"],
				required: true,
			},
			coordinates: {
				type: [Number],
				required: true,
			},
		},
		author: {
			type: Schema.Types.ObjectId,
			ref: "User",
		},
		reviews: [
			{
				type: Schema.Types.ObjectId,
				ref: "Review",
			},
		],
	},
	opts
);

CampgroundSchema.virtual("properties.popUpMarkup").get(function () {
	return `<h5> <a class="text-dark text-decoration-none" href="/campgrounds/${this._id}">${this.title}</a> </h5>`;
});

CampgroundSchema.post("findOneAndDelete", async (doc) => {
	if (doc) {
		await Review.deleteMany({ _id: { $in: doc.reviews } });
	}
});

module.exports = mongoose.model("Campground", CampgroundSchema);
