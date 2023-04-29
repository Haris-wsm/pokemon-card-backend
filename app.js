const express = require("express");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const passport = require("passport");
const helmet = require("helmet");
const errorHandler = require("./error/errorHandler");
const cors = require("cors");

const app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(
  cors({
    credentials: true,
    origin: [process.env.DOMIAN_DASHBOARD, process.env.DOMIAN_STORE],
  })
);
app.use(helmet({ crossOriginResourcePolicy: false }));

app.use(
  express.json({
    limit: "50mb", //size of json that transmit -> 100KB default
  })
);

app.use(passport.initialize());

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
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

app.use(require("./routes"));
app.use(errorHandler);

module.exports = app;
