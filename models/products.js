const Mongoose = require("mongoose");
const { ObjectId } = Mongoose.Schema.Types;

const shema = new Mongoose.Schema(
  {
    name: { type: String },
    desc: { type: String },
    price: { type: Number },
    status: { type: String, enum: ["in-stock", "out-stock"] },
    inStock: { type: Number },
    isSetPackage: { type: Boolean },
    sale: { type: Boolean },
    discount: { type: Number },
    image: { type: String },
    gallery: { type: [String] },
    ref_category: { type: ObjectId, ref: "categories" },
  },
  { timestamps: true }
);

module.exports = Mongoose.model("products", shema);
