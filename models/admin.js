const Mongoose = require("mongoose");

const shema = new Mongoose.Schema(
  {
    email: { type: String },
    hash: { type: String },
  },
  { timestamps: true }
);

module.exports = Mongoose.model("admins", shema);
