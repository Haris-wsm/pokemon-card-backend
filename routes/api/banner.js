const router = require("express").Router();

const bannerController = require("../../controller/banner");

router.get("/", bannerController.list);
router.delete("/:id", bannerController.deleteBanner);

module.exports = router;
