const router = require("express").Router();

const blogController = require("../../controller/blog");

router.get("/", blogController.list);
router.get("/:slug", blogController.getBlog);
router.put("/:slug", blogController.updateBlog);
router.delete("/:slug", blogController.deleteBlog);

router.post("/title-image", blogController.deleteTitleImage);

router.post(
  "/",
  // body("rawHtml").notEmpty().withMessage("ข้อความสร้างบล็อกจำเป็น"),
  // body("publish").notEmpty().withMessage("กำหนดเผยแพร่จำเป็น"),
  blogController.createBlog
);

module.exports = router;
