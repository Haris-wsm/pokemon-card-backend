const router = require("express").Router();

const { body } = require("express-validator");
const categoriesController = require("../../controller/category");

router.post(
  "/",
  body("name").notEmpty().withMessage("ชื่อประเภทจำเป็น"),
  categoriesController.create
);
router.get("/", categoriesController.list);
router.get("/:name", categoriesController.getByName);
router.put("/:id", categoriesController.update);
router.delete("/:id", categoriesController.delete);

module.exports = router;
