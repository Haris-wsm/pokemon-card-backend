const generate = require("nanoid/generate");
const fs = require("fs");
const path = require("path");
const dayjs = require("dayjs");
const duration = require("dayjs/plugin/duration");
const utc = require("dayjs/plugin/utc");
const timezone = require("dayjs/plugin/timezone");

const axios = require("axios");
const { validationResult } = require("express-validator");
const ValidationError = require("../error/ValidationError");

const OrderModel = require("../models/order");
const CodeModel = require("../models/code");
const { responseSuccess } = require("../utils/response");
const mongoose = require("mongoose");

dayjs.extend(utc);
dayjs.extend(duration);
dayjs.extend(timezone);

function random() {
  return generate("1234567890abcdef", 10);
}
const TEN_MINUTE = 1000 * 60 * 10;

exports.info = async (req, res, next) => {
  try {
    // Validation body request
    const result = validationResult(req);

    if (!result.isEmpty()) throw new ValidationError("Invalid body request.");

    const { amount, email, address, items } = req.body;

    // Random Reference no
    const noRef = random();

    const payload = {
      referenceNo: noRef,
      token: process.env.GB_TOKEN,
      amount: Number(amount),
      backgroundUrl: `${process.env.GB_BACKGROUND_URL}/api/webhook/${noRef}`,
    };

    // Request to GB Prime to retrieve QRCODE, reposne as type stream
    const config = {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      responseType: "stream",
    };

    const response = await axios.post(
      "https://api.gbprimepay.com/v3/qrcode",
      payload,
      config
    );

    // Save Resposne buffer as image
    const imageName = `${dayjs(new Date()).format(
      `YYYY-MM-DD-refno=${noRef}.png`
    )}`;
    const filePath = path.resolve(".", "public", "qrcode", imageName);

    const writer = fs.createWriteStream(filePath);
    response.data.pipe(writer);

    await new Promise((resolve, reject) => {
      writer.on("finish", resolve);
      writer.on("error", reject);
    });

    // Check image exist
    await fs.promises.access(filePath);

    // Correct Time/Zone
    // Get Timeout with 30 minute

    const bangkokDate = dayjs()
      .utcOffset(7 * 60)
      .toDate();
    const timestamp = bangkokDate.getTime();

    // Reservation Item for being booking and release if timout expires later

    /* ex. items = [{ _id: ObjectId(), qty: 3 }] */

    const { ObjectId } = mongoose.Types;

    const promises = items.map(async (item) => {
      const codeInStock = await CodeModel.countDocuments({ status: "unused" });
      if (Number(item.qty) > Number(codeInStock)) {
        throw new Error("จำนวนสินค้าไม่พอ");
      }

      const pipeline = [
        { $match: { ref_product: new ObjectId(item._id), status: "unused" } },
        { $limit: Number(item.qty) },
        { $project: { _id: 1, ref_product: 1 } },
      ];

      const codeList = await CodeModel.aggregate(pipeline);

      await CodeModel.updateMany(
        {
          _id: {
            $in: codeList.map((code) => code._id),
          },
        },
        { $set: { status: "used" } },
        { new: true }
      );
      return codeList;
    });

    const updatedItems = await Promise.all(promises);

    // Format products
    const results = updatedItems.map((updatedCodes) => {
      const fomatCodeList = updatedCodes.map((code) => ({
        ...code,
        ref_product: undefined,
      }));
      return { codes: fomatCodeList, ref_product: updatedCodes[0].ref_product };
    });

    const currentDate = new Date(timestamp + TEN_MINUTE);

    const orderData = {
      ref_no: noRef,
      amount,
      email,
      address,
      qrcode_image: `/images/qrcode/${imageName}`,
      timeout: currentDate,
      products: results,
    };

    if (req.body.ref_user) {
      orderData.ref_user = req.body.ref_user;
    }

    const order = await OrderModel.create(orderData);

    responseSuccess(res, "บันทึกออร์เดอร์สำเร็จ", 200, order);
  } catch (error) {
    console.log(error);
    next(error);
  }
};
