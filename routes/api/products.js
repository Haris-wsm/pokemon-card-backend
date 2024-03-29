const router = require("express").Router();

const productController = require("../../controller/products");
const middlewareValidator = require("../../middleware/products");

router.post("/", middlewareValidator.productCreate(), productController.create);

router.get("/", productController.list);
router.get("/top-sell", productController.topSell);
router.get("/newest", productController.listNew);
router.post("/user-cart", productController.checkUserCart);
router.get("/:id", productController.getOne);
router.get("/name/:name", productController.getByName);
router.get("/category/on-sale", productController.getOnSale);
router.get("/category/:name", productController.getByCategory);
router.get("/search/:word", productController.search);
router.put("/:id", productController.update);
router.delete("/:id", productController.delete);
router.get("/:id/codes", productController.getCodes);
router.post("/:id/codes", productController.createCodes);

router.post("/image-title/remove", productController.deleteImageTitle);
router.post("/image-gallery/remove", productController.deleteImageGallery);

router.put("/code/:id", productController.updateCode);
router.delete("/code/:id", productController.deleteCode);

module.exports = router;
