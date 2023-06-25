const CodeModel = require("../models/code");
const { responseSuccess } = require("../utils/response");

exports.deleteCodeList = async (req, res, next) => {
  try {
    await CodeModel.deleteMany({ _id: { $in: req.body.codes } });

    console.log("delete all successfully", req.body.codes);

    responseSuccess(res, "ลบข้อมูลสำเร็จ", 200);
  } catch (error) {
    console.log(error);
    next(error);
  }
};
