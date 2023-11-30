const {UserSchema} = require('../models/index')
const {Roles, Permission, Status} = require('../helper/enums')
const ErrorMessage = require('../utils/errorMessage');
const SuccessMessage = require('../utils/successMessage');
const { encrypt, comparePassword, generateToken } = require('../helper/utils');


const registerUser = async(req, res, next) => {
    try{
        const checkExistingUser = await UserSchema.find({
            $or:[
                {email:req.body.email},
                {contact_number: req.body.contact_number}
            ]
        }).lean(true)
        if(checkExistingUser.length > 0){
            res.status(403).json({status:false,message:ErrorMessage.ALREADY_EXISTS})
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
                permission: req.body.role && req.body.role === Roles.SUPERADMIN ? Permission.ALL: Permission.READ_ONLY,
                status: req.body.status ? req.body.status : Status.ACTIVE,
                verified: req.body.verified ? req.body.verified : true,
                registration_date: req.body.registration_date ? req.body.registration_date : Date.now(),
                login_time: null
            })
            if(newUser){
                res.status(201).json({status:true, message: SuccessMessage.REGISTER_SUCCESS, data:newUser})
            } else {
                res.status(403).json({status:false,message: ErrorMessage.INVALID_INPUT})
            }
        }
    } catch(error){
        console.log('Error-> ', error)
        return res.status(500).json({status:false,message: ErrorMessage.INTERNAL_SERVER_ERROR, error:error.message});
    }
};

const loginUser = async(req, res, next) => {
    try{
        const body = req.body;

        //check if input is email or not
        const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.input)
        const user = await UserSchema.findOne({
            $or:[
                {email: isEmail ? body.input: ''},
                {contact_number: isEmail ? '' : body.input}
            ],
            // status: Status.ACTIVE
        })
        if(!user){
            return res.status(404).json({status:false, message: `${ErrorMessage.USER_NOT_FOUND} with input ${body.input}`})
        }
        if(user.status !== Status.ACTIVE){
            return res.status(400).json({status:false, message: ErrorMessage.ACC_NOT_ACTIVE})
        }

        const isMatch = await comparePassword(body.password, user.password)
        if(!isMatch){
            return res.status(401).json({status:false, message: ErrorMessage.ERR_INVALID_CRED})
        }
        const userObject = {
            userId: user._id, 
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            contact_number: user.contact_number,
            role: user.role,
            permission: user.permission,
            status: user.status
        }
        const token = await generateToken(userObject)
        await UserSchema.updateOne({_id: user._id}, {login_time:new Date()})
        return res.status(200).json({status:true, message: SuccessMessage.SUCCESS_LOGIN, data:userObject, token:token})
    }catch(error){
        console.log('Error: ',error);
        return res.status(500).json({status:false, message: ErrorMessage.INTERNAL_SERVER_ERROR, error: error.message})
    }
}

module.exports = {registerUser, loginUser}