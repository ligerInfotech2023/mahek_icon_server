const express = require('express');
const memberRoutes = require('./memberRoute');

const routes = express.Router();

routes.use('/member', memberRoutes)


module.exports = routes;