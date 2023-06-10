const dayjs = require("dayjs");

require("dayjs/locale/th");

const ValidationError = require("../error/ValidationError");
const OrderModel = require("../models/order");
const SocketModel = require("../models/socket-client");
const transpoter = require("../utils/email/transporter");

// const nodemailer = require("nodemailer");
const template = require("../utils/email/template/order");

async function getOrderInfoPayload(order) {
  const products = await OrderModel.aggregate([
    { $match: { ref_no: order.ref_no } }, // filter the orders by ref_no
    { $unwind: "$products" }, // deconstruct the products array
    {
      $lookup: {
        // join with the products collection using the ref_product ObjectId
        from: "products",
        localField: "products.ref_product",
        foreignField: "_id",
        as: "product",
      },
    },
    { $unwind: "$product" }, // deconstruct the product array
    {
      $group: {
        // group the products by order _id
        _id: "$_id",
        products: {
          $push: {
            product: {
              _id: "$product._id",
              name: "$product.name",
              price: {
                $cond: {
                  // check if the product is on sale
                  if: { $eq: ["$product.sale", true] },
                  then: { $subtract: ["$product.price", "$product.discount"] }, // apply discount
                  else: "$product.price", // use regular price
                },
              },
              discount: "$product.discount",
              sale: "$product.sale",
              image: "$product.image",
              qty: { $size: "$products.codes" },
            },
          },
        },
      },
    },
    {
      $project: {
        _id: 1,
        products: 1,
      },
    },
  ]);

  const payload = {
    refNo: order.ref_no,
    total_price: order.amount,
    products: products[0].products,
    total_item: products[0].products.length,
    address: order.address,
  };

  return payload;
}

exports.paymentServiceGB = async (req, res, next) => {
  try {
    const { noRef } = req.params;
    const order = await OrderModel.findOne({
      ref_no: noRef,
    });

    if (!order) throw new ValidationError("ไม่พบรายการชำระสินค้า");

    // Check if timeout กรณีสินค้าหมดเวลา แต่มีการชำระภายหลัง
    const now = dayjs();
    const diff = dayjs(order.timeout).diff(now);

    if (diff <= 0) throw new ValidationError("หมดเวลาชำระสินค้า");

    // Create payload from query order for generate template

    const payload = await getOrderInfoPayload(order);
    const linkRedirect = process.env.DOMIAN_STORE + `/purchase/${order.ref_no}`;

    const mailoption = {
      to: order.email,
      subject: "รายการสั่งซื้อ Code ",
      from: process.env.GMAIL_USERNAME_SENDER_ITEM,
      html: template({ ...payload, link: linkRedirect }),
    };

    // Update payment sucess
    order.sucesss = true;
    await order.save();

    try {
      await transpoter.sendMail(mailoption);
      // update sending email success, if not cron will be sending later // no implement
      order.sending = true;
      await order.save();
    } catch (error) {
      console.log(error);
    }

    const socket = await SocketModel.findOne({ paymentId: noRef });

    const io = req.app.get("socketio");

    io.to(socket.clientId).emit("payment-success", { success: true });

    await res.send({ message: "โปรดตรวจสอบผ่านทางอีเมล" });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
