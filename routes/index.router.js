const express = require("express");
const router = express.Router();
const authController = require("../contollers/auth.controller");
const userController = require("../contollers/user.controller");
const serviceController = require("../contollers/service.controller")

router.post("/auth/login", authController.login);
router.post("/auth/register", authController.register);
router.post("/auth/confirmEmail", authController.confirmEmail);
router.post("/auth/sendResetCode", authController.sendResetCode);
router.post("/auth/resetPassword", authController.resetPassword);
router.post("/user/changeEmail", userController.changeEmail);
router.get("/user/getUser", userController.getUser);
router.post("/user/changePassword", userController.changePassword);
router.post("/service/createService", serviceController.createService);
router.post("/service/removeService", serviceController.removeService);
router.post("/service/updateService", serviceController.updateService);
router.get("/service/getServiceById", serviceController.getServiceById);
router.get("/service/getServices", serviceController.getServices);

module.exports = router;
