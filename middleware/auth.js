const { check } = require("express-validator");

exports.login = () => {
  return [
    check("email")
      .notEmpty()
      .withMessage("ชื่อประเภทจำเป็น")
      .isEmail()
      .withMessage("อีเมลไม่ถูกต้อง"),
    check("password").notEmpty().withMessage("รหัสผ่านจำเป็น"),
  ];
};
exports.loginUser = () => {
  return [
    check("email")
      .notEmpty()
      .withMessage("ชื่อประเภทจำเป็น")
      .isEmail()
      .withMessage("อีเมลไม่ถูกต้อง"),
    check("password").notEmpty().withMessage("รหัสผ่านจำเป็น"),
  ];
};
