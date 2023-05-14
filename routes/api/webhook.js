const router = require("express").Router();

const webhookController = require("../../controller/webhook");

router.post("/:noRef", webhookController.paymentServiceGB);

module.exports = router;
