const SocialModel = require("../models/social");
const { responseSuccess } = require("../utils/response");

exports.create = async (req, res, next) => {
  try {
    const social = await SocialModel.findOne({});

    if (social) {
      await SocialModel.findByIdAndUpdate(social._id, { ...req.body });
    } else {
      await SocialModel.create({ ...req.body });
    }

    responseSuccess(res, "สร้างสำเร็จ", 200);
  } catch (error) {
    next(error);
  }
};

exports.get = async (req, res, next) => {
  try {
    const social = await SocialModel.findOne({});

    responseSuccess(res, "สร้างสำเร็จ", 200, social);
  } catch (error) {
    next(error);
  }
};
