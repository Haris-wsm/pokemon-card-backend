const Mongoose = require("mongoose");

const shema = new Mongoose.Schema(
  {
    name: { type: String },
    lastname: { type: String },
    email: { type: String },
    hash: { type: String },
    address: { type: String },
    city: { type: String },
    province: { type: String },
    district: { type: String },
    amphoe: { type: String },
    zip: { type: String },
  },
  { timestamps: true }
);

module.exports = Mongoose.model("accounts", shema);
