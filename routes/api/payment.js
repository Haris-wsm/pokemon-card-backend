const router = require("express").Router();
const paymentController = require("../../controller/payment");

const middleware = require("../../middleware/payment");
router.post("/info", middleware.paymentInfo(), paymentController.info);

module.exports = router;
