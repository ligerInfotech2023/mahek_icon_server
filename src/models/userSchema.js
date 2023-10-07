const mongoose = require('mongoose');
const {Roles, Permission, Status} = require('../helper/enums')

const userSchema = new mongoose.Schema(
    {
        first_name:{
            type:String
        },
        last_name:{
            type:String
        },
        email:{
            type:String,
            required:true,
            unique:true
        },
        contact_number:{
            type:Number
        },
        password:{
            type:String,
            required:true,
        },
        confirm_password:{
            type:String,
        },
        role: {
            type: String,
            enum: Object.values(Roles)
        },
        permission: {
            type: String,
           enum: Object.values(Permission) 
        },
        status: {
            type: String,
            enum: Object.values(Status)
        },
        verified: {
            type: Boolean,
            default: false,
        },
        registration_date: {
            type: Date,
            default: Date.now()
        },
        login_time: {
            type: Date
        }
    },
    {
        collection:"tbl_user",
        timestamps:{
            createdAt:"created_date",
            updatedAt:"updated_date"
        }
    }
);

const UserSchema = mongoose.model("tbl_user", userSchema);

module.exports = UserSchema;