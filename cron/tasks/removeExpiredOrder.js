const OrderModel = require("../../models/order");
const CodeModel = require("../../models/code");

const THIRTYDAY_IN_MILLIS = 30 * 24 * 60 * 60 * 1000;

module.exports = async function () {
  try {
    // Get 30 days ago
    const options = { timeZone: "Asia/Bangkok" };

    const bangkokTime = new Date().toLocaleString("en-US", options);
    const nowInMillis = new Date(bangkokTime).getTime();

    const thirtyDayAgoInMillis = nowInMillis - THIRTYDAY_IN_MILLIS;
    const date = new Date(thirtyDayAgoInMillis);

    // Query Order With timeout
    const orders = await OrderModel.aggregate([
      { $match: { timeout: { $lt: date }, sucesss: true } },
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
      await remove(order.codes);
      await OrderModel.findByIdAndDelete(order._id);
    }

    console.log("Delete expired orders successfully");
  } catch (error) {
    console.log(error);
  }
};

const remove = async (codes) => {
  const objectIdList = codes.map((code) => code._id);

  await CodeModel.deleteMany({ _id: { $in: objectIdList } });
};
