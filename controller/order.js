const OrderModel = require("../models/order");
const { responseSuccess } = require("../utils/response");

exports.getOne = async (req, res, next) => {
  try {
    const { refNo } = req.params;

    // const order = await OrderModel.findOne({ ref_no: refNo });
    const order = await OrderModel.aggregate([
      { $match: { ref_no: refNo } },
      {
        $unwind: "$products",
      },
      {
        $lookup: {
          from: "codes",
          localField: "products.codes._id",
          foreignField: "_id",
          as: "products.codes",
        },
      },
      {
        $lookup: {
          from: "products",
          localField: "products.ref_product",
          foreignField: "_id",
          as: "products.ref_product",
        },
      },
      {
        $unwind: "$products.ref_product",
      },
      {
        $group: {
          _id: "$_id",
          ref_no: { $first: "$ref_no" },
          amount: { $first: "$amount" },
          email: { $first: "$email" },
          address: { $first: "$address" },
          products: { $push: "$products" },
          qrcode_image: { $first: "$qrcode_image" },
          timeout: { $first: "$timeout" },
          sucesss: { $first: "$sucesss" },
          createdAt: { $first: "$createdAt" },
          updatedAt: { $first: "$updatedAt" },
        },
      },
    ]);

    responseSuccess(res, "ดึงข้อมูลสำเร็จ", 200, { ...order[0] });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

exports.getMyCodes = async (req, res, next) => {
  try {
    console.log("user _id", req.user._id);
    const order = await OrderModel.find({
      ref_user: req.user._id,
      sucesss: true,
    });

    responseSuccess(res, "ดึงข้อมูลสำเร็จ", 200, order);
  } catch (error) {
    nect(error);
  }
};
