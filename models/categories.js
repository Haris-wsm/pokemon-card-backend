const Mongoose = require("mongoose");

const shema = new Mongoose.Schema({
  name: { type: String },
});

module.exports = Mongoose.model("categories", shema);
