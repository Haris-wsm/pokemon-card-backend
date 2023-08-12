const redis = require("redis");
const { responseSuccess } = require("../utils/response");

const client = redis.createClient({
  url: "redis://redis-client:6379",
});

client.connect();

exports.create = async (req, res, next) => {
  try {
    const { status = false, data = "" } = req.body;

    client.set("announcement_status", Boolean(status).toString());
    client.set("announcement_data", data);

    responseSuccess(res, "Successfully Create Announcement", 201);
  } catch (error) {
    next(error);
  }
};

exports.get = async (req, res, next) => {
  try {
    // await client.connect();

    const status = await client.get("announcement_status");
    const data = await client.get("announcement_data");

    // await client.disconnect();

    const payload = {
      status: JSON.parse(status),
      data,
    };

    responseSuccess(res, "Successfully Get Announcement", 200, payload);
  } catch (error) {
    console.log(error);
    next(error);
  }
};
