const multer = require("multer");
const ImageFileFormatError = require("../error/FileFormatError");
const { v4: uuidv4 } = require("uuid");

class UploadMiddleware {
  constructor(type, editor = false) {
    this.type = type;
    this.editor = editor;
    this.storage = this._getStorage();
  }

  _getStorage() {
    return multer.diskStorage({
      filename: this._getFilename(),
      destination: this._getDestination(),
    });
  }

  _getFilename() {
    return (_, file, cb) => {
      // let fileExtension = {
      //   "image/png": ".png",
      //   "image/jpeg": ".jpeg",
      //   "application/pdf": ".pdf",
      // };

      const ext = file.originalname.split(".").pop();

      // if (file.mimetype === "application/pdf") {
      //   cb(null, file.originalname);
      // } else {
      // }

      const random = uuidv4();
      let filename =
        file.fieldname + "-" + Date.now() + "-" + random + "." + ext;

      if (this.editor) {
        filename = "editor-" + filename;
      }

      cb(null, filename);
    };
  }

  _filter() {
    return (_, file, cb) => {
      const image =
        file.mimetype.startsWith("image/png") ||
        file.mimetype.startsWith("image/jpeg");

      if (image) {
        cb(null, true);
      } else {
        cb(
          new ImageFileFormatError(
            "sorry, we support only image with format jpeg and png"
          )
        );
      }
    };
  }

  _uploader() {
    return multer({
      storage: this.storage,
      // fileFilter: this._filter(),
    });
  }

  single(name) {
    return this._uploader().single(name);
  }
  multiple(name) {
    return this._uploader().array(name, 10);
  }

  _getDestination() {
    const type = this.type;

    return function (req, file, cb) {
      if (type === "product") {
        cb(null, "public/product/");
      } else if (type === "blog") {
        cb(null, "public/blog/");
      } else if (type === "about-us") {
        cb(null, "public/about-us/");
      } else if (type === "banner") {
        cb(null, "public/banner/");
      } else if (type === "website-editor") {
        cb(null, "public/website/");
      } else if (type === "file-attachment") {
        cb(null, "public/file-attachment/");
      } else {
        cb(null, "public/images/");
      }
    };
  }
}

module.exports = UploadMiddleware;
