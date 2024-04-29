const express = require("express");
const router = express.Router();
const authController = require("../contollers/auth.controller");
const userController = require("../contollers/user.controller");
const productController = require("../contollers/product.controller");
const orderController = require("../contollers/order.controller");

router.post("/auth/login", authController.login);
router.post("/auth/register", authController.register);
router.post("/auth/confirmEmail", authController.confirmEmail);
router.post("/user/changeEmail", userController.changeEmail);
router.get("/user/getUser", userController.getUser);
router.post("/user/changePassword", userController.changePassword);

module.exports = router;
