const router = require("express").Router();
const tagController = require("../../controller/tag");

router.get("/", tagController.getTags);
router.post("/", tagController.createTags);
router.post("/removal/list", tagController.deleteMany);
router.post("/removal/:id", tagController.deleteOne);

module.exports = router;
