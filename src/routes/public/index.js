const express = require('express');
const authRoute = require('./authRoutes')

const routes = express.Router()

routes.use('/auth', authRoute)

module.exports = routes;