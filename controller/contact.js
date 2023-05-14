const nodemailer = require("nodemailer");
const SocialModel = require("../models/social");
const template = require("../utils/email/template/contact");

const fs = require("fs");
const path = require("path");

exports.contact = async (req, res, next) => {
  try {
    const files = req.files;

    const { email, type } = req.body;

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USERNAME_CONTACT,
        pass: process.env.GMAIL_PASWORD_CONTACT,
      },
      secure: true,
    });

    // const transporter = nodemailer.createTransport({
    //   host: "smtp.ethereal.email",
    //   port: 587,
    //   auth: {
    //     user: "marques.koss40@ethereal.email",
    //     pass: "ZvFxuK22XTsMR6tmfn",
    //   },
    // });

    const social = await SocialModel.findOne({});

    if (!social) throw new Error("เกิดข้อผิดพลาด");

    const mailoption = {
      to: social.contact_email,
      subject: type,
      from: email,
      html: template({ ...req.body }),
      attachments: files.map((file, i) => {
        const filePath = path.resolve(
          ".",
          "public",
          "file-attachment",
          file.filename
        );

        return {
          filename: file.filename,
          content: fs.createReadStream(filePath),
        };
      }),
    };

    const info = await transporter.sendMail(mailoption);
    const url = nodemailer.getTestMessageUrl(info);

    res.send();
  } catch (error) {
    console.log(error);
    next(error);
  }
};
