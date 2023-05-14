if (process.env.NODE_ENV !== "development") {
  require("dotenv").config();
} else {
  require("./config/environtments");
}
const socketEvents = require("./socket");
const connectDB = require("./config/db");

const { server, io } = require("./app");
connectDB();

// cron jobs
require("./cron");

const port = process.env.PORT || 4000;

io.on("connection", (socket) => {
  console.log("WebSocket connection opened");

  socketEvents(socket, io);
});

server.listen(port, () => {
  console.log("listening on port " + port);
});
