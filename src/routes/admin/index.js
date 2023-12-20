const express = require('express');
const memberRoutes = require('./memberRoute');
const squareRoutes = require('./squareRoute')
const paymentReceiptRoutes = require('./paymentReceiptRoute')

const routes = express.Router();

routes.use('/member', memberRoutes)
routes.use('/square/rate', squareRoutes)
routes.use('/payment/receipt', paymentReceiptRoutes)


module.exports = routes;