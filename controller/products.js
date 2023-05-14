const { validationResult } = require("express-validator");
const ProductModel = require("../models/products");
const CodeModel = require("../models/code");
const CategoryModel = require("../models/categories");
const { responseSuccess } = require("../utils/response");
const ValidationError = require("../error/ValidationError");
const { default: mongoose } = require("mongoose");
const path = require("path");
const fs = require("fs/promises");

exports.create = async (req, res, next) => {
  try {
    const result = validationResult(req);

    if (!result.isEmpty()) throw new ValidationError("Invalid body request.");

    const product = await ProductModel.create(req.body);

    if (req.body.codes && req.body.codes.length > 0) {
      const productCodes = req.body.codes.map((code) => ({
        ...code,
        ref_product: product._id,
      }));

      await CodeModel.create(productCodes);
    }

    responseSuccess(res, "เพิ่มข้อมูลสำเร็จ", 201, product);
  } catch (error) {
    next(error);
  }
};

exports.checkUserCart = async (req, res, next) => {
  try {
    const { cart } = req.body;

    const { ObjectId } = mongoose.Types;

    const promises = cart.map(async (item) => {
      const product = await ProductModel.aggregate([
        { $match: { _id: new ObjectId(item._id) } },
        {
          $lookup: {
            from: "codes",
            localField: "_id",
            foreignField: "ref_product",
            as: "codes",
          },
        },
        {
          $unwind: { path: "$codes", preserveNullAndEmptyArrays: true },
        },
        {
          $group: {
            _id: "$_id",
            createdAt: { $first: "$createdAt" },
            discount: { $first: "$discount" },
            gallery: { $first: "$gallery" },
            image: { $first: "$image" },
            isSetPackage: { $first: "$isSetPackage" },
            name: { $first: "$name" },
            price: { $first: "$price" },
            ref_category: { $first: "$ref_category" },
            sale: { $first: "$sale" },
            status: { $first: "$status" },
            // stock: { $sum: 1 },
            stock: {
              $sum: { $cond: [{ $eq: ["$codes.status", "unused"] }, 1, 0] },
            },
          },
        },
        {
          $project: {
            _id: 1,
            createdAt: 1,
            discount: 1,
            gallery: 1,
            image: 1,
            isSetPackage: 1,
            name: 1,
            price: 1,
            ref_category: 1,
            sale: 1,
            status: 1,
            stock: 1,
          },
        },
      ]);

      const productData = product.length > 0 ? product[0] : {};

      const payload = {
        _id: item._id,
        name: productData.name || "",
        price: productData.price || 0,
        qty: item.qty,
        image: productData.image || "",
        isSetPackage: productData.isSetPackage || false,
        sale: productData.sale || false,
        discount: productData.discount || 0,
        stock: productData.stock || 0,
        validItem: false,
      };

      if (!product.length) return payload;

      if (product[0].stock === 0) return payload;

      if (product[0].stock < item.qty) return payload;

      if (product[0].stock < item.qty) return payload;

      payload.validItem = true;

      return payload;
    });

    const products = await Promise.all(promises);

    responseSuccess(res, "ดึงข้อมูลสำเร็จ", 200, products);
  } catch (error) {
    console.error(error);
    next(error);
  }
};

exports.topSell = async (req, res, next) => {
  try {
    const products = await ProductModel.aggregate([
      {
        $lookup: {
          from: "codes",
          localField: "_id",
          foreignField: "ref_product",
          as: "codes",
        },
      },
      {
        $unwind: {
          path: "$codes",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $group: {
          _id: "$_id",
          used: { $sum: { $cond: [{ $eq: ["$codes.status", "used"] }, 1, 0] } },
          image: { $first: "$image" },
          name: { $first: "$name" },
          desc: { $first: "$desc" },
          price: { $first: "$price" },
          status: { $first: "$status" },
          isSetPackage: { $first: "$isSetPackage" },
          sale: { $first: "$sale" },
          discount: { $first: "$discount" },
          gallery: { $first: "$gallery" },
          category: {
            $first: "$category",
          },
          updatedAt: { $first: "$updatedAt" },
        },
      },
      { $sort: { used: -1 } },
      { $limit: Number(req.query.limit) || 10 },
    ]);

    responseSuccess(res, "ค้นหาข้อมูลสำเร็จ", 200, products);
  } catch (error) {
    next(error);
  }
};

exports.list = async (req, res, next) => {
  try {
    const products = await ProductModel.aggregate([
      {
        $lookup: {
          from: "categories",
          localField: "ref_category",
          foreignField: "_id",
          as: "category",
        },
      },
      {
        $unwind: {
          path: "$category",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "codes",
          localField: "_id",
          foreignField: "ref_product",
          as: "codes",
        },
      },
      {
        $project: {
          image: 1,
          productName: "$name",
          totalCode: {
            $size: "$codes",
          },
          category: "$category.name",
          updatedAt: 1,
        },
      },
    ]);

    responseSuccess(res, "ค้นหาข้อมูลสำเร็จ", 200, products);
  } catch (error) {
    next(error);
  }
};

exports.listNew = async (req, res, next) => {
  try {
    const products = await ProductModel.aggregate([
      {
        $sort: {
          createdAt: 1,
        },
      },
      {
        $limit: Number(req.query.limit) || 30,
      },
      {
        $lookup: {
          from: "codes",
          localField: "_id",
          foreignField: "ref_product",
          as: "codes",
        },
      },
      {
        $unwind: "$codes",
      },
      {
        $match: {
          "codes.status": "unused",
        },
      },
      {
        $group: {
          _id: "$_id",
          createdAt: { $first: "$createdAt" },
          discount: { $first: "$discount" },
          gallery: { $first: "$gallery" },
          image: { $first: "$image" },
          isSetPackage: { $first: "$isSetPackage" },
          name: { $first: "$name" },
          price: { $first: "$price" },
          ref_category: { $first: "$ref_category" },
          sale: { $first: "$sale" },
          status: { $first: "$status" },
          stock: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 1,
          createdAt: 1,
          discount: 1,
          gallery: 1,
          image: 1,
          isSetPackage: 1,
          name: 1,
          price: 1,
          ref_category: 1,
          sale: 1,
          status: 1,
          stock: 1,
        },
      },
    ]);

    responseSuccess(res, "เพิ่มข้อมูลสำเร็จ", 200, products);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

exports.getOne = async (req, res, next) => {
  try {
    const { id } = req.params;

    const { ObjectId } = mongoose.Types;

    const product = await ProductModel.aggregate([
      { $match: { _id: new ObjectId(id) } },
      {
        $lookup: {
          from: "categories",
          localField: "ref_category",
          foreignField: "_id",
          as: "category",
        },
      },
      {
        $unwind: {
          path: "$category",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "codes",
          localField: "_id",
          foreignField: "ref_product",
          as: "codes",
        },
      },
      {
        $unwind: {
          path: "$codes",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $group: {
          _id: "$_id",
          used: { $sum: { $cond: [{ $eq: ["$codes.status", "used"] }, 1, 0] } },
          unused: {
            $sum: { $cond: [{ $eq: ["$codes.status", "unused"] }, 1, 0] },
          },
          image: { $first: "$image" },
          name: { $first: "$name" },
          desc: { $first: "$desc" },
          price: { $first: "$price" },
          status: { $first: "$status" },
          isSetPackage: { $first: "$isSetPackage" },
          sale: { $first: "$sale" },
          discount: { $first: "$discount" },
          gallery: { $first: "$gallery" },
          category: {
            $first: "$category",
          },
          updatedAt: { $first: "$updatedAt" },
        },
      },
    ]);

    responseSuccess(res, "ค้นหาข้อมูลสำเร็จ", 200, product[0]);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

exports.getOnSale = async (req, res, next) => {
  try {
    const { page = 1, limit = 30, sort } = req.query;

    const pipeline = [{ $match: { sale: true } }];

    if (sort === "name") {
      pipeline.push({ $sort: { name: 1 } });
    }

    if (sort === "onsale") {
      pipeline.push({ $match: { sale: true } });
    }

    if (sort === "maxprice") {
      pipeline.push({ $sort: { price: -1 } });
    }

    if (sort === "minprice") {
      pipeline.push({ $sort: { price: 1 } });
    }

    if (sort === "newest") {
      pipeline.unshift({ $sort: { createdAt: -1 } });
    }

    pipeline.push(
      { $skip: (page - 1) * limit },
      { $limit: parseInt(limit) },
      {
        $lookup: {
          from: "codes",
          localField: "_id",
          foreignField: "ref_product",
          as: "codes",
        },
      },
      {
        $unwind: {
          path: "$codes",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $group: {
          _id: "$_id",
          used: { $sum: { $cond: [{ $eq: ["$codes.status", "used"] }, 1, 0] } },
          unused: {
            $sum: { $cond: [{ $eq: ["$codes.status", "unused"] }, 1, 0] },
          },
          image: { $first: "$image" },
          name: { $first: "$name" },
          desc: { $first: "$desc" },
          price: { $first: "$price" },
          status: { $first: "$status" },
          isSetPackage: { $first: "$isSetPackage" },
          sale: { $first: "$sale" },
          discount: { $first: "$discount" },
          gallery: { $first: "$gallery" },
          category: {
            $first: "$category",
          },
          updatedAt: { $first: "$updatedAt" },
        },
      }
    );

    const [products, total] = await Promise.all([
      ProductModel.aggregate(pipeline),
      ProductModel.countDocuments({ sale: true }),
    ]);

    responseSuccess(res, "ดึงข้อมูลสำเร็จ", 200, { products, total });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

exports.search = async (req, res, next) => {
  try {
    const { page = 1, limit = 30, sort } = req.query;

    const matches = {
      $match: {
        $or: [
          // Search for exact matches in the name field
          { name: req.params.word },
          // Search for partial matches in the name field
          { name: { $regex: req.params.word, $options: "i" } },
        ],
      },
    };

    const pipeline = [matches];

    if (sort === "name") {
      pipeline.push({ $sort: { name: 1 } });
    }

    if (sort === "onsale") {
      pipeline.push({ $match: { sale: true } });
    }

    if (sort === "maxprice") {
      pipeline.push({ $sort: { price: -1 } });
    }

    if (sort === "minprice") {
      pipeline.push({ $sort: { price: 1 } });
    }

    if (sort === "newest") {
      pipeline.unshift({ $sort: { createdAt: -1 } });
    }

    pipeline.push(
      { $skip: (page - 1) * limit },
      { $limit: parseInt(limit) },
      {
        $lookup: {
          from: "codes",
          localField: "_id",
          foreignField: "ref_product",
          as: "codes",
        },
      },
      {
        $unwind: {
          path: "$codes",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $group: {
          _id: "$_id",
          used: { $sum: { $cond: [{ $eq: ["$codes.status", "used"] }, 1, 0] } },
          unused: {
            $sum: { $cond: [{ $eq: ["$codes.status", "unused"] }, 1, 0] },
          },
          image: { $first: "$image" },
          name: { $first: "$name" },
          desc: { $first: "$desc" },
          price: { $first: "$price" },
          status: { $first: "$status" },
          isSetPackage: { $first: "$isSetPackage" },
          sale: { $first: "$sale" },
          discount: { $first: "$discount" },
          gallery: { $first: "$gallery" },
          category: {
            $first: "$category",
          },
          updatedAt: { $first: "$updatedAt" },
        },
      }
    );

    const [products, total] = await Promise.all([
      ProductModel.aggregate(pipeline),
      ProductModel.countDocuments({
        $or: [
          { name: req.params.word }, // Search for exact matches in the name field
          { name: { $regex: req.params.word, $options: "i" } }, // Search for partial matches in the name field
        ],
      }),
    ]);

    responseSuccess(res, "ดึงข้อมูลสำเร็จ", 200, { products, total });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

exports.getByCategory = async (req, res, next) => {
  try {
    const category = await CategoryModel.findOne({ name: req.params.name });

    if (!category) throw new ValidationError("ไม่พบประเภทสินค้า");

    const { page = 1, limit = 30, sort } = req.query;

    const pipeline = [{ $match: { ref_category: category._id } }];

    if (sort === "name") {
      pipeline.push({ $sort: { name: 1 } });
    }

    if (sort === "onsale") {
      pipeline.push({ $match: { sale: true } });
    }

    if (sort === "maxprice") {
      pipeline.push({ $sort: { price: -1 } });
    }

    if (sort === "minprice") {
      pipeline.push({ $sort: { price: 1 } });
    }

    if (sort === "newest") {
      pipeline.push({ $sort: { createdAt: -1 } });
    }

    pipeline.push(
      { $skip: (page - 1) * limit },
      { $limit: parseInt(limit) },
      {
        $lookup: {
          from: "codes",
          localField: "_id",
          foreignField: "ref_product",
          as: "codes",
        },
      },
      {
        $unwind: {
          path: "$codes",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $group: {
          _id: "$_id",
          used: { $sum: { $cond: [{ $eq: ["$codes.status", "used"] }, 1, 0] } },
          unused: {
            $sum: { $cond: [{ $eq: ["$codes.status", "unused"] }, 1, 0] },
          },
          image: { $first: "$image" },
          name: { $first: "$name" },
          desc: { $first: "$desc" },
          price: { $first: "$price" },
          status: { $first: "$status" },
          isSetPackage: { $first: "$isSetPackage" },
          sale: { $first: "$sale" },
          discount: { $first: "$discount" },
          gallery: { $first: "$gallery" },
          category: {
            $first: "$category",
          },
          updatedAt: { $first: "$updatedAt" },
        },
      }
    );

    const [products, total] = await Promise.all([
      ProductModel.aggregate(pipeline),
      ProductModel.countDocuments({ ref_category: category._id }),
    ]);

    console.log(total);

    responseSuccess(res, "ดึงข้อมูลสำเร็จ", 200, { products, total });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

exports.delete = async (req, res, next) => {
  try {
    const { id: productId } = req.params;
    const product = await ProductModel.findById(productId);

    // Delete Image Title and Gallery

    // delete title
    if (product.image) {
      const imageName = product.image.split("/").pop();
      const imagePath = path.resolve(".", "public", "product", imageName);
      try {
        await fs.access(imagePath);
        await fs.unlink(imagePath);
      } catch (error) {}
    }

    // delete gallery
    if (product?.gallery && product?.gallery.length > 0) {
      for (const image of product.gallery) {
        const imageName = image.split("/").pop();
        const imagePath = path.resolve(".", "public", "product", imageName);
        try {
          await fs.access(imagePath);
          await fs.unlink(imagePath);
        } catch (error) {
          console.log(error);
        }
      }
    }

    // Delete Codes
    // Delete Product

    await Promise.all([
      CodeModel.deleteMany({ ref_product: productId }),
      product.deleteOne(),
    ]);

    responseSuccess(res, "ลบสินค้าสำเร็จ", 200, product[0]);
  } catch (error) {
    next(error);
  }
};

exports.getCodes = async (req, res, next) => {
  try {
    const { id: productId } = req.params;

    const { ObjectId } = mongoose.Types;

    const product = await ProductModel.aggregate([
      { $match: { _id: new ObjectId(productId) } },
      {
        $lookup: {
          from: "codes",
          localField: "_id",
          foreignField: "ref_product",
          as: "codes",
        },
      },
      {
        $project: {
          _id: 1,
          codes: 1,
        },
      },
    ]);

    responseSuccess(res, "ค้นหาข้อมูลสำเร็จ", 200, product);
  } catch (error) {
    next(error);
  }
};

exports.update = async (req, res, next) => {
  try {
    const { id } = req.params;
    const produuct = await ProductModel.findById(id);

    if (!produuct) throw new ValidationError("ไม่พบสินค้า");

    await ProductModel.findByIdAndUpdate(id, { ...req.body });
    responseSuccess(res, "แก้ไขสินค้าสำเร็จ", 200);
  } catch (error) {
    next(error);
  }
};

exports.deleteImageTitle = async (req, res, next) => {
  try {
    // add validation later
    const { image } = req.body;

    try {
      const imageName = image.split("/").pop();
      const imagePath = path.resolve(".", "public", "product", imageName);

      await fs.access(imagePath);
      await fs.unlink(imagePath);
    } catch (error) {}
    responseSuccess(res, "ลบแกลลอรี่สำเร็จ", 200);
  } catch (error) {
    next(error);
  }
};
exports.deleteImageGallery = async (req, res, next) => {
  try {
    // add validation later
    const { gallery } = req.body;

    for (const image of gallery) {
      const imageName = image.split("/").pop();
      const imagePath = path.resolve(".", "public", "product", imageName);
      try {
        await fs.access(imagePath);
        await fs.unlink(imagePath);
      } catch (error) {
        console.log(error);
      }
    }

    responseSuccess(res, "ลบแกลลอรี่สำเร็จ", 200);
  } catch (error) {
    next(error);
  }
};

exports.updateCode = async (req, res, next) => {
  try {
    const { id: codeId } = req.params;

    await CodeModel.findByIdAndUpdate(codeId, { code: req.body.code });
    responseSuccess(res, "ลบโค้ดสำเร็จ", 200);
  } catch (error) {
    next(error);
  }
};
exports.deleteCode = async (req, res, next) => {
  try {
    const { id: codeId } = req.params;

    await CodeModel.findByIdAndDelete(codeId);
    responseSuccess(res, "ลบโค้ดสำเร็จ", 200);
  } catch (error) {
    next(error);
  }
};
exports.createCodes = async (req, res, next) => {
  try {
    const { codes } = req.body;

    const payloadBody = codes.map((code) => ({
      code: code.code,
      ref_product: req.params.id,
    }));

    await CodeModel.create(payloadBody);
    responseSuccess(res, "ลบโค้ดสำเร็จ", 200);
  } catch (error) {
    console.log(error);
    next(error);
  }
};
