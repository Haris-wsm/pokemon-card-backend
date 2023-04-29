const router = require("express").Router();

router.use("/upload", require("./upload"));
router.use("/categories", require("./category"));
router.use("/products", require("./products"));
router.use("/banner", require("./banner"));
router.use("/website", require("./web-site"));
router.use("/blog", require("./blog"));
router.use("/auth", require("./auth"));
router.use("/dashboard", require("./dashboard"));

module.exports = router;
