const express = require('express');
const { addPaymentReceiptData, getPaymentReceiptList, editPaymentReceiptDetail, verifyPayment, } = require('../../controllers/paymentReceiptController');
const {addPaymentReceiptValidator, editPaymentReceiptValidator} = require('../../validator/paymentReceiptValidator');

const routes = express.Router()

routes.post('/add', addPaymentReceiptValidator(), addPaymentReceiptData);
routes.get('/list', getPaymentReceiptList);
routes.put('/edit', editPaymentReceiptValidator(), editPaymentReceiptDetail);


routes.post('/verify', verifyPayment)

module.exports = routes;