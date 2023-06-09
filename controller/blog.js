const BlogModel = require("../models/blog");
const { validationResult } = require("express-validator");
const { responseSuccess } = require("../utils/response");
const ValidationError = require("../error/ValidationError");
const fs = require("fs/promises");
const path = require("path");

exports.listNew = async (req, res, next) => {
  try {
    const blogs = await BlogModel.aggregate([
      { $match: { publish: true } },
      { $sort: { createdAt: -1 } },
      { $limit: Number(req.query.limit) || 3 },
    ]);

    responseSuccess(res, "ดึงข้อมูลสำเร็จ", 200, blogs);
  } catch (error) {
    console.log(error);
    next(error);
  }
};
exports.listPinPage = async (req, res, next) => {
  try {
    let blogs = [];

    // Query pinned blogs
    const pinnedBlogs = await BlogModel.aggregate([
      { $match: { pin: true } },
      { $sort: { createdAt: -1 } },
      { $limit: 3 },
    ]);

    // If pinned blogs are less than 2, or there are no pinned blogs, query blogs by date
    if (pinnedBlogs.length < 3) {
      const remainingLimit = 3 - pinnedBlogs.length;

      const nonPinnedBlogs = await BlogModel.aggregate([
        { $match: { pin: false, publish: true } },
        { $sort: { createdAt: -1 } },
        { $limit: remainingLimit },
      ]);

      blogs = [...pinnedBlogs, ...nonPinnedBlogs];
    } else {
      blogs = pinnedBlogs;
    }

    responseSuccess(res, "ดึงข้อมูลสำเร็จ", 200, blogs);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

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
      pin: body.pin,
      slug: body.slug,
      title: body.title,
      image: body.image,
    });

    responseSuccess(res, "เพิ่มข้อมูลสำเร็จ", 201);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

exports.list = async (req, res, next) => {
  try {
    const blogs = await BlogModel.aggregate([{ $sort: { createdAt: -1 } }]);

    responseSuccess(res, "ดึงข้อมูลสำเร็จ", 200, blogs);
  } catch (error) {
    next(error);
  }
};

exports.listHome = async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query; // default to page 1 and 10 items per page
    const [blogs, total] = await Promise.all([
      BlogModel.aggregate([
        { $sort: { createdAt: -1 } },
        { $match: { publish: true } },
        { $skip: (page - 1) * limit }, // skip items based on current page and limit
        { $limit: parseInt(limit) }, // limit items based on requested limit
      ]),
      BlogModel.countDocuments({ publish: true }), // get the total count of published blogs
    ]);

    responseSuccess(res, "ดึงข้อมูลสำเร็จ", 200, { blogs, total });
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
