const cron = require("node-cron");
const tasks = require("./tasks");

// This will run every 20 minute
cron.schedule("*/20 * * * *", async () => {
  await tasks.removeTimeoutPayment();
});

// This will run every 15 days
cron.schedule("0 0 */15 * *", async () => {
  await tasks.removeExpiredOrder();
});

// Run the job every 12 hours
cron.schedule("0 */12 * * *", async () => {
  await tasks.removeExpiredSocket();
});
