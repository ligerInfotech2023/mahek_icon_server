const express = require('express');

const {registerValidator, loginValidator} = require('../../validator/authValidator');
const { registerUser, loginUser } = require('../../controllers/authController');

const routes = express.Router()


routes.post('/register',registerValidator(), registerUser);
routes.post('/login', loginValidator(), loginUser)

module.exports = routes;