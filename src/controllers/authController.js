const {UserSchema} = require('../models/index')
const bcrypt = require('bcryptjs')
const {Roles, Permission, Status} = require('../helper/enums')
const ErrorMessage = require('../utils/errorMessage');
const SuccessMessage = require('../utils/successMessage');
const { encrypt } = require('../helper/utils');


const registerUser = async(req, res, next) => {
    try{
        const {email, contact_number} = req.body
        const checkExistingUser = await UserSchema.find({email,contact_number}).lean(true)
        if(checkExistingUser.length > 0){
            res.status(403).json({status:"Failed",message:ErrorMessage.ALREADY_EXISTS})
        } else{
          
            const hashedPassword = await encrypt(req.body.password);
            const hashedConfirmPassword = await encrypt(req.body.confirm_password);
            const newUser = await UserSchema.create({
                first_name: req.body.first_name ? req.body.first_name :null,
                last_name: req.body.last_name ? req.body.last_name :null,
                email: req.body.email ? req.body.email :null,
                contact_number: req.body.contact_number ? req.body.contact_number :null,
                password: req.body.password ? hashedPassword :null,
                confirm_password: req.body.confirm_password ? hashedConfirmPassword : null,
                role: req.body.role ? req.body.role : Roles.USER,
                permission: req.body.permission ? req.body.permission : Permission.READ_ONLY,
                status: req.body.status ? req.body.status : Status.ACTIVE,
                verified: req.body.verified ? req.body.verified : false,
                registration_date: req.body.registration_date ? req.body.registration_date : Date.now(),
                login_time: null
            })
            if(newUser){
                res.status(201).json({status:"success", message: SuccessMessage.REGISTER_SUCCESS, data:newUser})
            } else {
                res.status(403).json({status:"Failed",message: ErrorMessage.INVALID_INPUT})
            }
        }
    } catch(error){
        console.log('Error-> ', error)
        return res.status(400).json({status:"Failed",message: ErrorMessage.ERROR_REGISTER, error:error.message});
    }
};


module.exports = {registerUser}