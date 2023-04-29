const ProductModel = require("../models/products");
const CodeModel = require("../models/code");
const BlogModel = require("../models/blog");
const AccountModel = require("../models/account");
const CategoryModel = require("../models/categories");

const { responseSuccess } = require("../utils/response");

exports.summary = async (req, res, next) => {
  try {
    const countProduct = ProductModel.aggregate([{ $count: "count" }]);
    const countCode = CodeModel.aggregate([{ $count: "count" }]);
    const countBlog = BlogModel.aggregate([{ $count: "count" }]);
    const countAccount = AccountModel.aggregate([{ $count: "count" }]);
    const categoryAccount = CategoryModel.aggregate([{ $count: "count" }]);

    const [products, codes, blogs, accounts, category] = await Promise.all([
      countProduct,
      countCode,
      countBlog,
      countAccount,
      categoryAccount,
    ]);

    const payload = {
      products: products.length > 0 ? products[0].count : 0,
      codes: codes.length > 0 ? codes[0].count : 0,
      blogs: blogs.length > 0 ? blogs[0].count : 0,
      accounts: accounts.length > 0 ? accounts[0].count : 0,
      category: category.length > 0 ? category[0].count : 0,
    };

    responseSuccess(res, "ลบรูปภาพสำเร็จ", 201, payload);
  } catch (error) {
    next(error);
  }
};
