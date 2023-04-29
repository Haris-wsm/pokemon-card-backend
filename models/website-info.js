const Mongoose = require("mongoose");

const shema = new Mongoose.Schema(
  {
    raw_html: { type: String, default: "" },
    page: { type: String },
  },
  { timestamps: true }
);

module.exports = Mongoose.model("websiteInfo", shema);
