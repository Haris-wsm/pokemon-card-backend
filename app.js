const express = require("express");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const passport = require("passport");
const helmet = require("helmet");
const errorHandler = require("./error/errorHandler");
const cors = require("cors");

const http = require("http");
const socketIO = require("socket.io");

const app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const ENV = require("./config/constant");

app.use(
  cors({
    credentials: true,
    origin: [ENV.DOMIAN_DASHBOARD, ENV.DOMIAN_STORE],
  })
);
app.use(helmet({ crossOriginResourcePolicy: false }));

app.use(
  express.json({
    limit: "50mb", //size of json that transmit -> 100KB default
  })
);

app.use(passport.initialize());

// Set headers to allow credentials
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", req.headers.origin);
  res.header("Access-Control-Allow-Credentials", true);
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.use("/images/product", express.static("public/product"));
app.use("/images/banner", express.static("public/banner"));
app.use("/images/site-image", express.static("public/website"));
app.use("/images/product/editor", express.static("public/product"));
app.use("/images/blog", express.static("public/blog"));
app.use("/images/qrcode", express.static("public/qrcode"));
app.use("/public/file-attachment',", express.static("public/file-attachment"));

app.use(require("./routes"));
app.use(errorHandler);

const server = http.createServer(app); // Create Node.js HTTP server
const io = socketIO(server); // Create Socket.io server

app.set("socketio", io);

module.exports = { server, io };
