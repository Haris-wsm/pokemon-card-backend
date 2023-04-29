const WebSiteModel = require("../models/website-info");
const { responseSuccess } = require("../utils/response");

exports.uploadPageHTML = async (req, res, next) => {
  try {
    const { pageName } = req.params;

    const existingPage = await WebSiteModel.findOne({ page: pageName });

    if (existingPage) {
      existingPage.raw_html = req.body.rawHTML;
      await existingPage.save();
    } else {
      await WebSiteModel.create({ raw_html: req.body.rawHTML, page: pageName });
    }

    responseSuccess(res, "Successfully updated the page", 201);
  } catch (error) {
    next(error);
  }
};
exports.getPageHTML = async (req, res, next) => {
  try {
    const { pageName } = req.params;

    const existingPage = await WebSiteModel.findOne({ page: pageName });

    const data = existingPage ?? { raw_html: "" };

    responseSuccess(res, "Successfully updated the page", 201, data);
  } catch (error) {
    next(error);
  }
};
