const Mongoose = require("mongoose");

const shema = new Mongoose.Schema({
  paymentId: {
    type: String,
    required: true,
    unique: true,
  },
  clientId: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: "24h", // automatically delete documents older than 24 hours
  },
});

module.exports = Mongoose.model("socketClients", shema);
