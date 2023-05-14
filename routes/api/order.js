const router = require("express").Router();
const orderController = require("../../controller/order");

const userPassportJWT = require("../../middleware/userPassport");

router.get("/my-codes", userPassportJWT.isLogin, orderController.getMyCodes);
router.get("/:refNo", orderController.getOne);

module.exports = router;
