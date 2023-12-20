const mongoose = require('mongoose');

const paymentRecordSchema = new mongoose.Schema(
    {
        paymentReceiptId:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "tbl_payment_receipt"
        },
        orderId:{
            type: String
        },
        paymentId:{
            type:String
        },
        razorpaySignature:{
            type:String
        },
        receiptNumber:{
            type: String
        },
        amount:{
            type: Number,
        },
        paymentStatus:{
            type: String,
            default: 'Pending'
        }
    },
    {
        collection: "tbl_payment_records",
        timeseries:{
            createdAt: 'created_date',
            updatedAt: 'updated_date'
        }
    }
)

const PaymentRecordSchema = mongoose.model('tbl_payment_records', paymentRecordSchema)
module.exports = PaymentRecordSchema;