const TagModel = require("../models/tag");
const { responseSuccess } = require("../utils/response");

const { ObjectId } = require("mongoose").Types;

exports.createTags = async (req, res, next) => {
  try {
    // req body =>
    //     tags = [
    //         { name: "" },
    //         { name: "" },
    //         { name: "" },
    //     ]

    if (req.body.tags && req.body.tags?.length > 0) {
      await TagModel.insertMany(req.body.tags);
    }

    responseSuccess(res, "Created tags successfully.", 200);
  } catch (error) {
    next(error);
  }
};

exports.getTags = async (req, res, next) => {
  try {
    const tags = await TagModel.find({});

    responseSuccess(res, "Created tags successfully.", 200, tags);
  } catch (error) {
    next(error);
  }
};

exports.deleteOne = async (req, res, next) => {
  try {
    await TagModel.findByIdAndDelete(req.params.id);
    const remainTags = await TagModel.find({});

    responseSuccess(res, "Deleted a tag successfully.", 200, remainTags);
  } catch (error) {
    next(error);
  }
};

exports.deleteMany = async (req, res, next) => {
  try {
    const tagIdList = req.body.tagsId;

    await TagModel.deleteMany({
      _id: { $in: tagIdList.map((tag) => new ObjectId(tag)) },
    });

    const remainTags = await TagModel.find({});
    responseSuccess(res, "Deleted a tag successfully.", 200, remainTags);
  } catch (error) {
    next(error);
  }
};
