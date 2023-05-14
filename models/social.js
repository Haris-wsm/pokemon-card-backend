const Mongoose = require("mongoose");

const shema = new Mongoose.Schema({
  facebook: {
    type: String,
  },
  instagram: {
    type: String,
  },
  twitter: {
    type: String,
  },
  contact_email: {
    type: String,
  },
});

module.exports = Mongoose.model("socials", shema);
