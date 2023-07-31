// dayjs libs
const dayjs = require("dayjs");
const duration = require("dayjs/plugin/duration");
const utc = require("dayjs/plugin/utc");
const timezone = require("dayjs/plugin/timezone");

// Model
const OrderModel = require("../models/order");

// Utils
const { responseSuccess } = require("../utils/response");

dayjs.extend(utc);
dayjs.extend(duration);
dayjs.extend(timezone);

exports.getOrderStatisTic = async (req, res, next) => {
  try {
    const options = { timeZone: "Asia/Bangkok" };
    const bangkokTime = new Date().toLocaleString("en-US", options);
    const bangkokDate = new Date(bangkokTime);

    const dataset = {
      month: [
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0,
      ],
      year: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    };

    const ordersInYear = await OrderModel.aggregate([
      {
        $group: {
          _id: { $month: "$createdAt" },
          totalOrders: { $sum: 1 },
        },
      },
      {
        $group: {
          _id: null,
          data: { $push: { month: "$_id", totalOrders: "$totalOrders" } },
        },
      },
      {
        $project: {
          data: {
            $map: {
              input: { $range: [1, 12] },
              as: "month",
              in: {
                $mergeObjects: [
                  { month: "$$month" },
                  {
                    $arrayElemAt: [
                      {
                        $filter: {
                          input: "$data",
                          cond: { $eq: ["$$this.month", "$$month"] },
                        },
                      },
                      0,
                    ],
                  },
                ],
              },
            },
          },
        },
      },
      {
        $unwind: "$data",
      },
      {
        $replaceRoot: { newRoot: "$data" },
      },
      {
        $project: {
          _id: "$month",
          totalOrders: { $ifNull: ["$totalOrders", 0] },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);

    // Get the start of the current month
    const startOfMonth = new Date(
      bangkokDate.getFullYear(),
      bangkokDate.getMonth(),
      1
    );

    // Get the start of the next month
    const nextMonth = bangkokDate.getMonth() + 1;
    const startOfNextMonth = new Date(bangkokDate.getFullYear(), nextMonth, 1);

    // Convert the dates to ISO format
    const startOfMonthISO = startOfMonth.toISOString();
    const startOfNextMonthISO = startOfNextMonth.toISOString();

    const ordersInMonth = await OrderModel.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(startOfMonthISO),
            $lt: new Date(startOfNextMonthISO),
          },
        },
      },
      {
        $group: {
          _id: { $dayOfMonth: "$createdAt" },
          totalOrders: { $sum: 1 },
        },
      },
      {
        $group: {
          _id: null,
          data: { $push: { day: "$_id", totalOrders: "$totalOrders" } },
        },
      },
      {
        $project: {
          day: {
            $map: {
              input: { $range: [1, 31] },
              as: "d",
              in: {
                $let: {
                  vars: {
                    matchedData: {
                      $arrayElemAt: [
                        {
                          $filter: {
                            input: "$data",
                            cond: { $eq: ["$$this.day", "$$d"] },
                          },
                        },
                        0,
                      ],
                    },
                  },
                  in: {
                    $ifNull: ["$$matchedData.totalOrders", 0],
                  },
                },
              },
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          days: "$day",
        },
      },
    ]);

    dataset.year = ordersInYear.map((o) => o.totalOrders);

    if (ordersInMonth.length > 0) {
      dataset.month = ordersInMonth[0].days;
    }

    responseSuccess(res, "Get Statistic Ordering Success", 200, dataset);
  } catch (error) {
    next(error);
  }
};

exports.getOrderToday = async (req, res, next) => {
  try {
    // 24h ago
    const options = { timeZone: "Asia/Bangkok" };
    const bangkokTime = new Date().toLocaleString("en-US", options);

    const current = new Date(bangkokTime);
    current.setHours(0, 0, 0, 0);
    current.setMonth(current.getMonth());

    const startOfDay = current.getTime();

    current.setHours(23, 59, 59, 999);
    const endOfDay = current.toISOString();

    // const twentyHourAgo = nowInMillis - TWENTYHOUR_IN_MILLIS;

    const startDate = new Date(startOfDay);
    const endDate = new Date(endOfDay);

    const orders = await OrderModel.aggregate([
      {
        $match: {
          createdAt: {
            $gte: startDate,
            $lte: endDate,
          },
        },
      },
      {
        $unwind: "$products",
      },
      {
        $lookup: {
          from: "products",
          localField: "products.ref_product",
          foreignField: "_id",
          as: "productInfo",
        },
      },
      {
        $group: {
          _id: "$products.ref_product",
          productName: { $first: { $arrayElemAt: ["$productInfo.name", 0] } },
          image: { $first: { $arrayElemAt: ["$productInfo.image", 0] } },
          total: { $sum: 1 },
        },
      },
    ]);

    responseSuccess(res, "Get Statistic Today Ordering Success", 200, orders);
  } catch (error) {
    next(error);
  }
};
