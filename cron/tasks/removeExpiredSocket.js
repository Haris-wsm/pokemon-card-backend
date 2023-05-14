const SocketModel = require("../../models/socket-client");

const TWENTYHOUR_IN_MILLIS = 24 * 60 * 60 * 1000;

module.exports = async function () {
  try {
    // 24h ago
    const options = { timeZone: "Asia/Bangkok" };
    const bangkokTime = new Date().toLocaleString("en-US", options);

    const nowInMillis = new Date(bangkokTime).getTime();
    const twentyHourAgo = nowInMillis - TWENTYHOUR_IN_MILLIS;

    const date = new Date(twentyHourAgo);

    await SocketModel.deleteMany({ createdAt: { $lt: date } });
  } catch (error) {
    console.log(error);
  }
};
