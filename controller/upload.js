const BannerModel = require("../models/banner");
const SiteImageModel = require("../models/site-image");

exports.uploadEditorImage = async (req, res, next) => {
  try {
    res.send({ url: `/images/product/editor/${req.file.filename}` });
  } catch (error) {
    next(error);
  }
};
exports.uploadProductTitle = async (req, res, next) => {
  try {
    res.send({ url: `/images/product/${req.file.filename}` });
  } catch (error) {
    next(error);
  }
};
exports.uploadProductGallery = async (req, res, next) => {
  try {
    const files = req.files;
    const fileDocuments = [];

    for (const file of files) {
      const fileName = `/images/product/${file.filename}`;
      fileDocuments.push(fileName);
    }
    res.send({ url: fileDocuments });
  } catch (error) {
    next(error);
  }
};
exports.uploadBanner = async (req, res, next) => {
  try {
    const imagePath = `/images/banner/${req.file.filename}`;
    await BannerModel.create({ image: imagePath });
    res.send({ url: imagePath });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
exports.uploadBlog = async (req, res, next) => {
  try {
    const imagePath = `/images/blog/${req.file.filename}`;
    res.send({ url: imagePath });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

exports.uploadSiteImage = async (req, res, next) => {
  try {
    const imagePath = `/images/site-image/${req.file.filename}`;
    await SiteImageModel.create({ image: imagePath });
    res.send({ url: imagePath });
  } catch (error) {
    next(error);
  }
};
