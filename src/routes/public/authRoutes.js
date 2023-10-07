const express = require('express');

const {registerValidator} = require('../../validator/authValidator');
const { registerUser } = require('../../controllers/authController');

const routes = express.Router()


routes.post('/register',registerValidator(), registerUser);

module.exports = routes;