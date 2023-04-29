const { validationResult } = require("express-validator");
const CategoryModel = require("../models/categories");
const { responseSuccess } = require("../utils/response");
const ValidationError = require("../error/ValidationError");

exports.create = async (req, res, next) => {
  try {
    const result = validationResult(req);

    if (!result.isEmpty()) throw new ValidationError("Invalid body request.");

    const { name } = req.body;
    const category = await CategoryModel.findOne({ name });

    if (category) throw new ValidationError("Duplicate category.");

    await CategoryModel.create({ name });
    responseSuccess(res, "เพิ่มข้อมูลสำเร็จ", 201);
  } catch (error) {
    next(error);
  }
};

exports.list = async (req, res, next) => {
  try {
    const category = await CategoryModel.find();

    responseSuccess(res, "Created category.", 200, category);
  } catch (error) {
    next(error);
  }
};

exports.update = async (req, res, next) => {
  try {
    const { id: catergoryId } = req.params;

    const category = await CategoryModel.findOne({ name: req.body.name });

    if (category) throw new ValidationError("ชือประเภทซ้ำ");

    await CategoryModel.findByIdAndUpdate(catergoryId, { name: req.body.name });

    responseSuccess(res, "Updated category.", 201);
  } catch (error) {
    next(error);
  }
};

exports.delete = async (req, res, next) => {
  try {
    const { id: catergoryId } = req.params;

    await CategoryModel.findByIdAndDelete(catergoryId);
    responseSuccess(res, "Deleted category.", 201);
  } catch (error) {
    next(error);
  }
};
