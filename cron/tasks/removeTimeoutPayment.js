const OrderModel = require("../../models/order");
const CodeModel = require("../../models/code");

const THIRTY_MINUTE = 30 * 60 * 1000;

module.exports = async function () {
  try {
    // Get 30 minute time ago

    const options = { timeZone: "Asia/Bangkok" };

    const bangkokTime = new Date().toLocaleString("en-US", options);

    const thirtyMinuteAgoInMillis =
      new Date(bangkokTime).getTime() - THIRTY_MINUTE;

    const date = new Date(thirtyMinuteAgoInMillis);

    // Query Order With timeout
    const orders = await OrderModel.aggregate([
      { $match: { timeout: { $lt: date }, sucesss: false } },
      {
        $project: {
          products: 1,
        },
      },
      {
        $unwind: {
          path: "$products",
          includeArrayIndex: "string",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $unwind: {
          path: "$products.codes",
          includeArrayIndex: "string",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $group: {
          _id: "$_id",
          codes: {
            $push: "$products.codes",
          },
        },
      },
    ]);

    for (const order of orders) {
      await resetCodeStatus(order.codes);
      await OrderModel.findByIdAndDelete(order._id);
    }

    console.log("Remove timeout payment successful");
  } catch (error) {
    console.log(error);
  }
};

const resetCodeStatus = async (codes) => {
  const objectIdList = codes.map((code) => code._id);

  await CodeModel.updateMany(
    { _id: { $in: objectIdList } },
    { status: "unused" }
  );
};