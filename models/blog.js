const Mongoose = require("mongoose");

const shema = new Mongoose.Schema(
  {
    raw_html: { type: String },
    title: { type: String },
    slug: { type: String },
    image: { type: String },
    publish: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = Mongoose.model("blogs", shema);
