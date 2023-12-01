const express = require('express');
const { addNewMemberValidator, editExistingMemberValidator } = require('../../validator/memberValidator');
const { addNewMember, editExistingMember, showMemberList, showOneMember, memberReport } = require('../../controllers/membersController');

const routes = express.Router();

routes.post('/create', addNewMemberValidator(), addNewMember);
routes.put('/edit/:id', editExistingMemberValidator(), editExistingMember);
routes.get('/list', showMemberList);
routes.get('/show/:id', showOneMember);
routes.get('/report', memberReport)

module.exports = routes;