const Mongoose = require("mongoose");

const shema = new Mongoose.Schema(
  {
    username: { type: String },
    email: { type: String },
    hash: { type: String },
    address: { type: String },
    town: { type: String },
    province: { type: String },
    district: { type: String },
    state: { type: String },
    zip: { type: String },
  },
  { timestamps: true }
);

module.exports = Mongoose.model("accounts", shema);
