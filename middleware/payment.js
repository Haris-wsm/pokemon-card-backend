const { check } = require("express-validator");

exports.paymentInfo = () => {
  return [
    check("amount")
      .notEmpty()
      .withMessage("ราคาจำเป็น")
      .isNumeric()
      .withMessage("ต้องเป็นตัวเลขเท่านั้น"),
    check("email")
      .notEmpty()
      .withMessage("อีเมลจำเป็น")
      .isEmail()
      .withMessage("อีเมลไม่ถูกต้อง"),
    check("address").notEmpty().withMessage("ที่อยู่จำเป็น"),
    check("items")
      .notEmpty()
      .withMessage("ที่อยู่จำเป็น")
      .isArray()
      .withMessage("รูปแบบข้อมูลไม่ถูกต้อง"),
  ];
};
