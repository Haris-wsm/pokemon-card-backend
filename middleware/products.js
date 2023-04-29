const { check } = require("express-validator");

exports.productCreate = () => {
  return [
    check("name").notEmpty().withMessage("ชื่อประเภทจำเป็น"),
    check("price")
      .notEmpty()
      .withMessage("ราคาจำเป็น")
      .isNumeric()
      .withMessage("ต้องเป็นตัวเลขเท่านั้น"),
    check("status")
      .notEmpty()
      .withMessage("ราคาจำเป็น")
      .isIn(["in-stock", "out-stock"])
      .withMessage("สถานะไม่ถูกต้อง"),
    // check("inStock")
    //   .notEmpty()
    //   .withMessage("จำนวนจำเป็น")
    //   .isNumeric()
    //   .withMessage("ต้องเป็นตัวเลขเท่านั้น"),
    check("isSetPackage")
      .notEmpty()
      .withMessage("ประเภทการขายจำเป็น")
      .isBoolean()
      .withMessage("ต้องเป็น true หรือ false"),
    check("sale")
      .notEmpty()
      .withMessage("โปรโมชั่นจำเป็น")
      .isBoolean()
      .withMessage("ต้องเป็น true หรือ false"),
    check("discount")
      .notEmpty()
      .withMessage("จำนวนลดราคาจำเป็น")
      .isNumeric()
      .withMessage("ต้องเป็นตัวเลขเท่านั้น"),
    check("image").notEmpty().withMessage("รูปภาพจำเป็น"),
    check("gallery").notEmpty().withMessage("รูปภาพจำเป็น"),
    check("ref_category").notEmpty().withMessage("ประเภทสินค้าจำเป็น"),
  ];
};
