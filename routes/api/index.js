const router = require("express").Router();

router.use("/upload", require("./upload"));
router.use("/categories", require("./category"));
router.use("/products", require("./products"));
router.use("/banner", require("./banner"));
router.use("/website", require("./web-site"));
router.use("/blog", require("./blog"));
router.use("/auth", require("./auth"));
router.use("/dashboard", require("./dashboard"));
router.use("/webhook", require("./webhook"));
router.use("/payment", require("./payment"));
router.use("/orders", require("./order"));
router.use("/contact", require("./contact"));
router.use("/social", require("./social"));
router.use("/test", require("./test"));

module.exports = router;
