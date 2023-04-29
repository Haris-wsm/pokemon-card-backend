const Mongoose = require("mongoose");

const shema = new Mongoose.Schema(
  {
    image: { type: String },
  },
  { timestamps: true }
);

module.exports = Mongoose.model("banners", shema);
