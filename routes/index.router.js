const express = require("express")
const router = express.Router()
const authController = require("../contollers/auth.controller")
const userController = require("../contollers/user.controller");
const productController = require("../contollers/product.controller");
const orderController = require("../contollers/order.controller");


router.post("/auth/login", authController.login)
router.post("/auth/register", authController.register)
router.post('/user/changeEmail', userController.changeEmail)
router.get('/user/getUser', userController.getUser)
router.post('/user/changePassword', userController.changePassword)
router.post('/product/createProduct', productController.createProduct)
router.get('/product/getProduct', productController.getProductById)
router.get('/product/getAllProducts', productController.getAllProducts)
router.post('/product/updateProduct', productController.updateProduct)
router.post('/order/createOrder', orderController.createOrder)
router.get('/order/getOrders', orderController.getOrders)
router.get('/order/getOrderById', orderController.getOrderById)

module.exports = router