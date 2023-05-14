const AdminModel = require("../models/admin");
const AccountModel = require("../models/account");
const argon2 = require("argon2");
const jwt = require("jsonwebtoken");

const ValidationError = require("../error/ValidationError");
const { responseSuccess } = require("../utils/response");
const { validationResult } = require("express-validator");

const ENV = require("../config/constant");

exports.login = async (req, res, next) => {
  try {
    const result = validationResult(req);
    if (!result.isEmpty()) throw new ValidationError("Invalid body request.");

    const { email, password } = req.body;

    const admin = await AdminModel.findOne({ email });

    if (!admin) throw new ValidationError("ไม่พบผู้ใช้งาน");
    if (await argon2.verify(admin.hash, password)) {
      const payload = { id: admin._id };

      const data = jwt.sign(payload, ENV.SALT);
      responseSuccess(res, "เข้าสู่ระบบสำเร็จ", 201, data);
    } else {
      throw new ValidationError("ไม่พบผู้ใช้งาน");
    }
  } catch (error) {
    next(error);
  }
};

exports.loginUser = async (req, res, next) => {
  try {
    const result = validationResult(req);
    console.log(result.array());
    if (!result.isEmpty()) throw new ValidationError("Invalid body request.");

    const { email, password } = req.body;

    const user = await AccountModel.findOne({ email });

    if (!user) throw new ValidationError("ไม่พบผู้ใช้งาน");

    if (await argon2.verify(user.hash, password)) {
      const payload = { id: user._id };

      const data = jwt.sign(payload, ENV.SALT);
      responseSuccess(res, "เข้าสู่ระบบสำเร็จ", 201, data);
    } else {
      console.log("password not match");
      throw new ValidationError("ไม่พบผู้ใช้งาน");
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
};
exports.register = async (req, res, next) => {
  try {
    const result = validationResult(req);
    if (!result.isEmpty()) throw new ValidationError("Invalid body request.");

    const { email, password } = req.body;

    const admin = await AdminModel.findOne({ email });

    if (admin) throw new ValidationError("ชื่อผู้ใช้ซ้ำ");

    const hash = await argon2.hash(password);

    await AdminModel.create({ email, hash });

    responseSuccess(res, "ลงทะเบียนสำเร็จ", 201);
  } catch (error) {
    next(error);
  }
};

exports.registerUser = async (req, res, next) => {
  try {
    // const result = validationResult(req);
    // if (!result.isEmpty()) throw new ValidationError("Invalid body request.");

    const { email, password } = req.body;

    const admin = await AccountModel.findOne({ email });

    if (admin) throw new ValidationError("ชื่อผู้ใช้ซ้ำ");

    const hash = await argon2.hash(password);

    await AccountModel.create({ ...req.body, hash });

    responseSuccess(res, "ลงทะเบียนสำเร็จ", 201);
  } catch (error) {
    next(error);
  }
};

exports.getProfile = async (req, res, next) => {
  try {
    const user = await AccountModel.findById(req.user.id);
    user.hash = undefined;
    responseSuccess(res, "ดึงข้อมูลสำเร็จ", 200, user);
  } catch (error) {
    console.log(error);
    next(error);
  }
};
