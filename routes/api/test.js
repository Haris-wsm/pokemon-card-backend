const router = require("express").Router();

const OrderModel = require("../../models/order");
const template = require("../../utils/email/template/order");
const transpoter = require("../../utils/email/transporter");

const nodemailer = require("nodemailer");

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

router.get("/email/:ref", async (req, res, next) => {
  try {
    const order = await OrderModel.findOne({ ref_no: req.params.ref });

    if (!order) throw new Error("No such order");

    const payload = await getOrderInfoPayload(order);

    const linkRedirect = process.env.DOMIAN_STORE + `/purchase/${order.ref_no}`;

    const mailoption = {
      to: order.email,
      subject: "Hello ✔",
      from: "test@mail.com",
      html: template({ ...payload, link: linkRedirect }),
    };

    const info = await transpoter.sendMail(mailoption);
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));

    res.send(template(payload));
    // res.send(payload);
  } catch (error) {
    console.log(error);
    next(error);
  }
});

module.exports = router;
