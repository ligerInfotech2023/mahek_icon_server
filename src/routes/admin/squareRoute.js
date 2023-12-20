const express = require('express');
const { addSquareRates, getSquareListByTypes } = require('../../controllers/squareRatesController');
const { addSquareRateValidator } = require('../../validator/squareRateValidator');
const routes = express.Router()


routes.post('/add', addSquareRateValidator(), addSquareRates)
routes.get('/list', getSquareListByTypes)

module.exports = routes;