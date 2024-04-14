const indexRouter = require('express').Router();
const authRoutes = require('./authRouts/authRoutes');

indexRouter.use('/auth', authRoutes);

module.exports = indexRouter;
