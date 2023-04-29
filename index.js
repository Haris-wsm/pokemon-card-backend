require("dotenv").config();
const connectDB = require("./config/db");
const app = require("./app");
connectDB();

const port = process.env.PORT || 4000;

app.listen(port, () => {
  console.log("listening on port " + port);
});
