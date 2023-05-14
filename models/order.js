const Mongoose = require("mongoose");
const { ObjectId } = Mongoose.Schema.Types;

const shema = new Mongoose.Schema(
  {
    ref_no: { type: String },
    amount: { type: String },
    email: { type: String },
    address: { type: Object },
    products: { type: Object },
    qrcode_image: { type: String },
    link: { type: String },
    timeout: { type: Date },
    sucesss: { type: Boolean, default: false },
    sending: { type: Boolean, default: false },
    ref_user: { type: ObjectId, ref: "accounts" },
  },
  { timestamps: true }
);

module.exports = Mongoose.model("orders", shema);
