const authRouters = require("express").Router();

const loginRoute = require("./loginRoute");
const registerRoute = require("./registerRoute");
const checkUser = require("./checkUser");

authRouters.use("/register", registerRoute);
authRouters.use("/login", loginRoute);
authRouters.use("/check", checkUser);

module.exports = authRouters;
