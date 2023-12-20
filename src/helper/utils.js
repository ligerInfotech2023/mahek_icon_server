const jwt = require('jsonwebtoken')
const passwordHash = require('pbkdf2-password-hash')
const numToWords = require('num-words')
const { PaymentReceiptSchema } = require('../models')

const encrypt = async(password) => {
    return await passwordHash.hash(password, {iterations: 100, digest: 'sha1', keylen: 16, saltlen: 16})
}

const comparePassword = async(plainPassword, hashedPassword) => {
    return await passwordHash.compare(plainPassword, hashedPassword)
}

const generateToken = async(user) => {
    try{
        const token = jwt.sign({user}, process.env.jwt_secret_key,{ expiresIn:process.env.jwt_expiration_time})
        return token;
    }catch(err){
        console.log('Error while generating token: ',err)
        throw new Error(err)
    }
}

const checkPermission = async(role, permission, user) => {
    
    if(!user || !user.permission || !user.role){
        return false;
    }
    //if user.permission is a string, check if it matches the required permission or not
    if(typeof user.permission === 'string' && typeof user.role === 'string'){
        if(user.permission !== permission || user.role !== role){
            return false;
        }
    } else if(Array.isArray(user.permission) && !user.permission.includes(permission) || Array.isArray(user.role) && !user.role.includes(role)){
        return false;
    }
    return true;
}

const getPagination = (page,size) => {
    const limit = Number.parseInt(size) 
    const Page = Number.parseInt(page) || 1
    const offset = (Page - 1) * limit;
    return {limit, offset};
}

const manageSorting = async(key,sort) => {
    const sortOptions = {};
    if(key && sort){
        sortOptions[key] = sort === '-1' ? -1 : 1;
    } 
    return sortOptions;
}

const generateName = async(type, date) => {
    const formattedDate = new Date(date).getFullYear()
    const name = `${formattedDate} ${(type).charAt(0).toUpperCase() + type.slice(1)}`
    return name;
}

const convertToWords = async(amount) => {

    const inWords = `Rupees ${numToWords(amount)} only`;

    return inWords

    //for decimal point value(like 15.2)
    // const [number, decimalNumber] = num.toString().split('.');
    // let result = numberToWords.toWords(parseInt(number, 10));

    // if(decimalNumber){
    //     const decimalWord = numberToWords.toWords(parseInt(decimalNumber, 10));
    //     result += ` point ${decimalWord}`
    // }
    // return result;

}

const generateReceiptNumber = async() => {
    //Query to the PaymentReceiptSchema to find the latest receipt_number and increment it
    const latestPayment = await PaymentReceiptSchema.findOne().sort({receipt_number:-1}).limit(1);
    const latestReceiptNumber = latestPayment ? latestPayment.receipt_number: 0 ;
    
    return latestReceiptNumber + 1;

}


module.exports = {
    encrypt, 
    comparePassword, 
    generateToken, 
    checkPermission,
    getPagination,
    manageSorting, 
    generateName, 
    convertToWords, 
    generateReceiptNumber,
};