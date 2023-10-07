const mongoose = require('mongoose');
const { SquareRateType } = require('../helper/enums');
SquareRateType
const squareRateSchema = new mongoose.Schema(
    {
        name:{
            type: String,
        },
        select_type:{
            type:String,
            enum: Object.values(SquareRateType)
        },
        sqft_rate:{
            type:String
        },
        effective_start_date:{
            type:Date
        },
        effective_end_date:{
            type:Date,
        },
        collection_start_date:{
            type:Date,
        },
        collection_end_date:{
            type:Number
        }
    }, 
    {
        collection:"tbl_square_rate",
        timestamps:{
            createdAt:"created_date",
            updatedAt:"updated_date"
        }
    }
);

const SquareRateSchema = mongoose.model('tbl_square_rate', squareRateSchema)

module.exports = SquareRateSchema;