const OrderModel = require("../../models/order");
const CodeModel = require("../../models/code");

const dayjs = require("dayjs");
const duration = require("dayjs/plugin/duration");
const utc = require("dayjs/plugin/utc");
const timezone = require("dayjs/plugin/timezone");

const TWENTY_MINUTE = 15 * 60 * 1000;

dayjs.extend(utc);
dayjs.extend(duration);
dayjs.extend(timezone);

module.exports = async function () {
  try {
    // Get 20 minute time ago

    const bangkokTime = dayjs()
      .utcOffset(7 * 60)
      .toDate();

    const twentyMinuteAgoInMillis = bangkokTime.getTime() - TWENTY_MINUTE;

    const date = new Date(twentyMinuteAgoInMillis);

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
