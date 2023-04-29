const fs = require("fs");
const path = require("path");

const createFolder = (folderPath) => {
  if (!fs.existsSync(folderPath)) {
    try {
      fs.mkdirSync(folderPath, { recursive: true });
    } catch (err) {
      console.error(`Error creating folder ${folderPath}: `, err);
      process.exit(1);
    }
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
