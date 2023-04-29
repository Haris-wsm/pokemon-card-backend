const express = require("express");
const multer = require("../../utils/multer");
const router = express.Router();

const uploadController = require("../../controller/upload");

// Uploade Image from "description field of product editor"
router.post(
  "/editor/product",
  new multer("product", true).single("image"),
  uploadController.uploadEditorImage
);

router.post(
  "/editor/website",
  new multer("website-editor", false).single("image"),
  uploadController.uploadSiteImage
);

// Uploade Image title "product"
router.post(
  "/product/title",
  new multer("product", false).single("image"),
  uploadController.uploadProductTitle
);
// Uploade Image gallery "product"
router.post(
  "/product/gallery",
  new multer("product", false).multiple("images"),
  uploadController.uploadProductGallery
);

// Uploade Image "banner"
router.post(
  "/banner",
  new multer("banner", false).single("image"),
  uploadController.uploadBanner
);
// Uploade Image "blog" editor
router.post(
  "/editor/blog",
  new multer("blog", true).single("image"),
  uploadController.uploadBlog
);

router.post(
  "/blog/title",
  new multer("blog", false).single("image"),
  uploadController.uploadBlog
);

module.exports = router;
