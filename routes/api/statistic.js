const router = require("express").Router();
const statisticController = require("../../controller/statistic");

router.get("/order", statisticController.getOrderStatisTic);
router.get("/order/today", statisticController.getOrderToday);

module.exports = router;
