const path = require("path");
const BannerModel = require("../models/banner");
const { responseSuccess } = require("../utils/response");
const { promises: fs } = require("fs");

exports.list = async (req, res, next) => {
  try {
    const banner = await BannerModel.find({});
    responseSuccess(res, "Successful get banners.", 200, banner);
  } catch (error) {
    next(error);
  }
};

exports.deleteBanner = async (req, res, next) => {
  try {
    const { id } = req.params;

    const banner = await BannerModel.findById(id);

    if (!banner) throw new Error("Banner not found");

    const url = banner.image;

    const imageName = url.split("/").pop();
    const imagePath = path.resolve("public", "banner", imageName);

    try {
      await fs.access(imagePath);
      await fs.unlink(imagePath);
      await banner.deleteOne();

      responseSuccess(res, "Successfully Delete a Banner", 201);
    } catch (error) {
      await banner.deleteOne();
      throw new Error("Image not found.");
    }
  } catch (error) {
    next(error);
  }
};
