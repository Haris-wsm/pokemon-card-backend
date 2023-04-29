const Mongoose = require("mongoose");
const { ObjectId } = Mongoose.Schema.Types;

const shema = new Mongoose.Schema(
  {
    code: { type: String },
    status: { type: String, enum: ["used", "unused"], default: "unused" },
    ref_product: { type: ObjectId, ref: "products" },
  },
  { timestamps: true }
);

module.exports = Mongoose.model("codes", shema);
