const BlogModel = require("../models/blog");
const { validationResult } = require("express-validator");
const { responseSuccess } = require("../utils/response");
const ValidationError = require("../error/ValidationError");
const fs = require("fs/promises");
const path = require("path");
const { log } = require("console");

exports.createBlog = async (req, res, next) => {
  try {
    const result = validationResult(req);

    if (!result.isEmpty()) throw new ValidationError("Invalid body request.");

    const { body } = req;

    const existBlog = await BlogModel.findOne({ slug: body.slug });

    if (existBlog) throw new ValidationError("ชื่อหัวข้อเรื่องถูกใช้ไปแล้ว");

    await BlogModel.create({
      raw_html: body.rawHtml,
      publish: body.publish,
      slug: body.slug,
      title: body.title,
      image: body.image,
    });

    responseSuccess(res, "เพิ่มข้อมูลสำเร็จ", 201);
  } catch (error) {
    next(error);
  }
};

exports.list = async (req, res, next) => {
  try {
    const blogs = await BlogModel.aggregate([{ $sort: { createdAt: -1 } }]);

    responseSuccess(res, "เพิ่มข้อมูลสำเร็จ", 200, blogs);
  } catch (error) {
    next(error);
  }
};

exports.getBlog = async (req, res, next) => {
  try {
    const blog = await BlogModel.findOne({ slug: req.params.slug });

    responseSuccess(res, "เพิ่มข้อมูลสำเร็จ", 200, blog);
  } catch (error) {
    next(error);
  }
};

exports.updateBlog = async (req, res, next) => {
  try {
    // const blog = await BlogModel.findOne({ slug: req.params.slug });

    const updatedBlog = await BlogModel.findOneAndUpdate(
      { slug: req.params.slug },
      { ...req.body },
      { new: true }
    );

    responseSuccess(res, "อัพเดตข้อมูลสำเร็จ", 201, updatedBlog);
  } catch (error) {
    console.log(error);
    next(error);
  }
};
exports.deleteBlog = async (req, res, next) => {
  try {
    const blog = await BlogModel.findOne({ slug: req.params.slug });

    if (!blog) throw new ValidationError("ไม่พบบล็อก");

    // delete image
    try {
      const imageName = blog.image.split("/").pop();
      const imagPath = path.resolve(".", "public", "blog", imageName);
      await fs.access(imagPath);

      await fs.unlink(imagPath);
    } catch (error) {}

    await blog.deleteOne();

    responseSuccess(res, "อัพเดตข้อมูลสำเร็จ", 201);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

exports.deleteTitleImage = async (req, res, next) => {
  try {
    const { image } = req.body;

    try {
      const imageName = image.split("/").pop();
      const imagPath = path.resolve(".", "public", "blog", imageName);
      await fs.access(imagPath);

      await fs.unlink(imagPath);
    } catch (error) {}
    responseSuccess(res, "ลบรูปภาพสำเร็จ", 201);
  } catch (error) {
    console.log(error);
    next(error);
  }
};
