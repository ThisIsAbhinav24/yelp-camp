const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review");
const User = require("./user");

const CampgroundSchema = new Schema({
  title: String,
  image: String,
  price: Number,
  description: String,
  location: String,
  author:{
    type: Schema.Types.ObjectId,
    ref:'User'
  },
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
});
CampgroundSchema.post("findOneAndDelete", async function (doc) {
  if (doc) {
    await Review.remove({
      _id: { $in: doc.review },
    });
  }
});
module.exports = mongoose.model("Campground", CampgroundSchema);
