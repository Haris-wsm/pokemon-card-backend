const fs = require("fs");
const path = require("path");

const createFolder = (path) => {
  if (!fs.existsSync(path)) {
    fs.mkdirSync(path);
  }
};

const publicPath = path.resolve(".", "public");

const banner = path.resolve(publicPath, "banner");
const blog = path.resolve(publicPath, "blog");
const images = path.resolve(publicPath, "images");
const product = path.resolve(publicPath, "product");
const website = path.resolve(publicPath, "website");

createFolder(banner);
createFolder(blog);
createFolder(images);
createFolder(product);
createFolder(website);
