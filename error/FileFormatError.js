class ImageFileFormatError extends Error {
  constructor(message) {
    super(message);
    this.name = "ImageFileFormatError";
    this.statusCode = 409;
  }
}

module.exports = ImageFileFormatError;
