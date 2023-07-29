const router = require("express").Router();

const authController = require("../../controller/auth");
const middlewareValidator = require("../../middleware/auth");

const userPassportJWT = require("../../middleware/userPassport");

// For Authentication Admin
router.post("/login", middlewareValidator.login(), authController.login);
router.post("/register", middlewareValidator.login(), authController.register);

// For Authentication User
router.post(
  "/login/user",
  middlewareValidator.loginUser(),
  authController.loginUser
);
router.post("/register/user", authController.registerUser);

// Get User
router.get("/user-profile", userPassportJWT.isLogin, authController.getProfile);

module.exports = router;
