const nodemailer = require("nodemailer");

const transpoter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USERNAME_SENDER_ITEM,
    pass: process.env.GMAIL_PASWORD_SENDER_ITEM,
  },
  secure: true,
});
// const transpoter = nodemailer.createTransport({
//   host: "smtp.ethereal.email",
//   port: 587,
//   auth: {
//     user: "rashawn.kunze95@ethereal.email",
//     pass: "bBFT7xqGS2ZDFreQZ8",
//   },
// });

module.exports = transpoter;
