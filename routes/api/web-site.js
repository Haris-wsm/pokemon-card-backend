const express = require("express");
const router = express.Router();

const websiteController = require("../../controller/web-site");

// Uploade Image from "description field of product editor"
router.post("/:pageName", websiteController.uploadPageHTML);
router.get("/:pageName", websiteController.getPageHTML);

module.exports = router;
