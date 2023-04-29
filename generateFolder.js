const fs = require("fs");
const path = require("path");

const createFolder = (path) => {
  if (!fs.existsSync(path)) {
    fs.mkdirSync(path);
  }
};

const publicPath = path.resolve(".", "public");

const banner = path.join(publicPath, "banner");
const blog = path.join(publicPath, "blog");
const images = path.join(publicPath, "images");
const product = path.join(publicPath, "product");
const website = path.join(publicPath, "website");

createFolder(banner);
createFolder(blog);
createFolder(images);
createFolder(product);
createFolder(website);
