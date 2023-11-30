const jwt = require('jsonwebtoken');
const errorMessage = require('../utils/errorMessage');
const { UserSchema } = require('../models');
const { Status } = require('../helper/enums');


const userAuth = async(req, res, next) => {
    try{
        //check if token is present in header 
        if(!req.header('Authorization')){
            return res.status(403).json({status:false, message: errorMessage.ERROR_TOKEN_REQUIRED})
        }
        //removing bearer keyword
        const token = req.header('Authorization').replace('Bearer ', '').trim()
        //verifying token
        const decoded = jwt.verify(token, process.env.jwt_secret_key, {ignoreExpiration:false})
        //finding user with details decoded from token
        const userData = await UserSchema.findOne({_id: decoded.user.userId,status:Status.ACTIVE})
        if(!userData){
            return res.status(403).json({status:false, message: errorMessage.ERROR_INVALID_TOKEN})
        }
        req.token = token
        req.user = userData
        next()

    }catch(err){
        console.log('Error in userAuth-> ',err);
        if(err.message == 'jwt malformed'){
            return res.status(400).json({status:false, message: errorMessage.ERROR_INVALID_TOKEN})
        }else{
            return res.status(400).json({status:false, message: err.message})
        }
    }
}

module.exports = {userAuth}