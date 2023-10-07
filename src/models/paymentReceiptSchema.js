const mongoose = require('mongoose');
const { PaymentType } = require('../helper/enums');

const paymentReceipSchema = new mongoose.Schema(
    {
        pay_date:{
            type:Date,
            default: Date.now(),
            required:true
        },
        receipt_number:{
            type: Number
        },
        shop_number:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"tbl_member",
            required:true
        },
        total_square_feet:{
            type:Number
        },
        owner_name:{
            type:String
        },
        member_fee:{
            type:Number
        },
        share_capital:{
            type:Number
        },
        land_amount:{
            type:Number
        },
        construction_fund:{
            type:Number
        },
        transfer_fee:{
            type:Number
        },
        n_a_conversion_amount:{
            type:Number
        },
        deposit:{
            type:Number
        },
        total_amount:{
            type:Number
        },
        total_amount_in_words:{
            type:String
        },
        payment_type:{
            type:String,
            enum: Object.values(PaymentType)
        },
        transaction_number:{
            type:Number
        },
        bank_name:{
            type:String
        },
        cheque_number:{
            type:Number
        },
        account_number:{
            type:Number
        },
        cash_amount:{
            type:Number
        },
        upi_id:{
            type:String
        },
        receiver_name:{
            type:String
        }
    },
    {
        collection:"tbl_payment_receipt",
        timestamps:{
            createdAt:"created_date",
            updatedAt:"updated_date"
        }
    }
);

const PaymentReceiptSchema = mongoose.model('tbl_payment_receipt', paymentReceipSchema);

module.exports = PaymentReceiptSchema;