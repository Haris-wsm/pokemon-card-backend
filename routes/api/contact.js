const router = require("express").Router();

const contactController = require("../../controller/contact");

const multer = require("../../utils/multer");

router.post(
  "/",
  new multer("file-attachment").multiple("files"),
  contactController.contact
);

module.exports = router;
