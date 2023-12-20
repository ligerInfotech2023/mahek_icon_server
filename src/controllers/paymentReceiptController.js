const { Roles, Permission, PaymentType } = require("../helper/enums");
const { generateReceiptNumber, checkPermission, convertToWords, getPagination, renderHTMLFile } = require("../helper/utils");
const { MemberSchema, PaymentReceiptSchema } = require("../models");
const errorMessage = require("../utils/errorMessage");
const Razorpay = require('razorpay');
const successMessage = require("../utils/successMessage");
const crypto = require("crypto");

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET 
})


const addPaymentReceiptData = async(req,res, next) => {
    try{

        if(!await checkPermission(Roles.SUPERADMIN, Permission.ALL, req.user)){
            return res.status(401).json({status:false, message: errorMessage.PERMISSION_DENIED})
        }
        const body = req.body;
        const {
            shop_number,
            owner_name,
            member_fee,
            share_capital,
            land_amount,
            construction_fund,
            transfer_fee,
            n_a_conversion_amount,
            maintenance_amount,
            deposit,
            penalty,
            payment_type,
        } = req.body

        const findShop = await MemberSchema.findOne({shop_number:req.body.shop_number})
        if(!findShop || findShop.length === 0){
            return res.status(404).json({status:false, message:`shop_number ${shop_number} not found in records`})
        }
   
        const totalAmount = member_fee + share_capital + land_amount + construction_fund + transfer_fee + n_a_conversion_amount + maintenance_amount + deposit + penalty ;
        
        const receiptNumber = await generateReceiptNumber();

        const totalAmountInWords = await convertToWords(totalAmount)

        for(const [field, value] of Object.entries(body)){
            if(value > findShop[field]){
                return res.status(404).json({status:false, message:`${field} must be less than or equal to ${findShop[field]}`})
            }
        }
        const cashAmount = body && body.payment_type === PaymentType.CASH ? totalAmount : null;
        const addPaymentReceipt = {
            pay_date: Date.now(),
            receipt_number: receiptNumber,
            shop_number: body.shop_number,
            owner_name: findShop ? findShop.owner_name_1 : body.owner_name,
            total_square_feet:findShop.total_shop_size,
            member_fee: body && body.member_fee ? body.member_fee : findShop.member_fee,
            share_capital: body && body.share_capital ? body.share_capital : findShop.share_capital,
            land_amount: body && body.land_amount ? body.land_amount : findShop.land_amount,
            construction_fund: body && body.construction_fund ? body.construction_fund : findShop.construction_fund,
            transfer_fee: body && body.transfer_fee ? body.transfer_fee : findShop.transfer_fee,
            n_a_conversion_amount: body && body.n_a_conversion_amount ? body.n_a_conversion_amount : findShop.n_a_conversion_amount,
            maintenance_amount: body && body.maintenance_amount ? body.maintenance_amount : findShop.maintenance,
            deposit: body && body.deposit ? body.deposit : findShop.deposit,
            penalty: body && body.penalty ? body.penalty : 0,
            total_amount:totalAmount,
            total_amount_in_words: totalAmountInWords,
            payment_type: body && body.payment_type ? body.payment_type : PaymentType.CASH,
            transaction_number: body && body.transaction_number ? body.transaction_number : null,
            bank_name: body && body.bank_name ? body.bank_name : null,
            cheque_number: body && body.cheque_number ? body.cheque_number : null,
            account_number: body && body.account_number ? body.account_number : null,
            cash_amount: cashAmount,
            upi_id: body && body.upi_id ? body.upi_id : null,
            receiver_name: body && body.receiver_name ? body.receiver_name : null,
            orderId: null
        }
   
        let razorpayOptions = {}
        if(addPaymentReceipt.payment_type === PaymentType.UPI){
            const order = await razorpay.orders.create({
                amount: totalAmount * 100,
                currency: 'INR',
                receipt: receiptNumber.toString(),
                payment_capture: true    // Capture the payment immediately
            })
    
            razorpayOptions = {
                key: razorpay.key_id,
                order_id:order.id,
                amount: order.amount,
                currency: order.currency,
                name: owner_name,
                description:'Payment for maintenance',
                receiptNo:order.receipt,
                prefill:{
                    name: addPaymentReceipt.receiver_name,
                    shop_number:addPaymentReceipt.shop_number,
                    method:addPaymentReceipt.payment_type 
                },
                theme:{
                    color:'#F37254'
                }
            }
            addPaymentReceipt.orderId = addPaymentReceipt.payment_type === PaymentType.UPI ? order.id : null
        }
        const saveReceiptData = await PaymentReceiptSchema.create(addPaymentReceipt)
        if(saveReceiptData){
            const pendingMemberFee = findShop ? findShop.member_fee - saveReceiptData.member_fee : 0
            const peddingShareCapital = findShop ? findShop.share_capital - saveReceiptData.share_capital : 0
            const pendingLandAmount = findShop ? findShop.land_amount - saveReceiptData.land_amount : 0
            const pendingConstAmount = findShop ? findShop.construction_fund - saveReceiptData.construction_fund : 0
            const pendingTransferFee = findShop ? findShop.transfer_fee - saveReceiptData.transfer_fee : 0
            const pendingNAConversion = findShop ? findShop.n_a_conversion_amount - saveReceiptData.n_a_conversion_amount : 0
            const pendingMaintenance = findShop ? findShop.maintenance - saveReceiptData.maintenance_amount : 0
            const pendingDeposit = findShop ? findShop.deposit - saveReceiptData.deposit : 0

            const updateObject = {
                pending_member_fee:pendingMemberFee, 
                pending_maintenance:pendingMaintenance, 
                pending_transfer_fee:pendingTransferFee, 
                pending_share_capital: peddingShareCapital, 
                pending_land_amount: pendingLandAmount, 
                pending_construction_fund: pendingConstAmount, 
                pending_n_a_conversion_amount: pendingNAConversion, 
                pending_deposit: pendingDeposit 
            }
            await MemberSchema.updateOne({shop_number:findShop.shop_number},updateObject )

            res.status(200).json({status:true, data: saveReceiptData, razorpayOptions })
        }else{
            res.status(403).json({status:false, message: errorMessage.ERR_CREATE})
        }

    }catch(err){
        console.log('Error while adding payment receipt data: ',err);
        res.status(500).json({status:false, message: errorMessage.INTERNAL_SERVER_ERROR, error: err.message})
    }
}

const verifyPayment = async(req, res) => {
    try{

        if(!await checkPermission(Roles.SUPERADMIN, Permission.ALL, req.user)){
            return res.status(401).json({status:false, message: errorMessage.PERMISSION_DENIED})
        }
        //receive payment data  
        const {order_id, payment_id} = req.body;
        const razorpay_signature = req.headers['x-razorpay-signature'];
        const key_secret = process.env.RAZORPAY_KEY_SECRET 

        //Verification & Send Response to User

        //Creating hmac object

        const hmac = crypto.createHmac('sha256', key_secret);

        //passing data to be hashed

        hmac.update(order_id + "|" + payment_id);
        
        //crearting hmac in required format
        const generated_signature = hmac.digest('hex');
        
        
        if(razorpay_signature === generated_signature){
            res.status(200).json({status:true, message:"Payment has been verified"})
        }else{
            res.status(402).json({status:false, message:"Payment verification failed!"})
        }
        
    }catch(err){
        console.log('Error while verify payment: ',err);
        res.status(500).json({status:false, message: errorMessage.INTERNAL_SERVER_ERROR, error: err.message})

    }
}

const getPaymentReceiptList = async(req, res) => {
    try{
        const {receiptno, sort, key,page, size} = req.query;
        const {limit, offset} = getPagination(page, size)
        let findQuery = {}

        if(receiptno){
            findQuery.receipt_number = receiptno;
        }
        
        const findData = await PaymentReceiptSchema.find(findQuery).select('-__v').skip(offset).limit(limit).exec()

        if(!findData || findData.length === 0){
            return res.status(404).json({status:false, message: errorMessage.NO_DATA})
        }
        return res.status(200).json({status:false, message: successMessage.FETCH_SUCCESS, data: findData})
    }catch(error){
        console.log('Error while fetch payment receipt data: ',error);
        res.status(500).json({status:false, message: errorMessage.INTERNAL_SERVER_ERROR, error:error.message})
    }
}


const editPaymentReceiptDetail = async(req, res) => {
    try{
        const {id} = req.params;
        const body = req.body;

        if(!await checkPermission(Roles.SUPERADMIN, Permission.ALL, req.user)){
            return res.status(401).json({status:false, message:errorMessage.PERMISSION_DENIED})
        }

        const findData = await PaymentReceiptSchema.findOne({_id:id})

        if(!findData || findData.length === 0){
            return res.status(404).json({status:false, message:`${errorMessage.NO_DATA} found for this id ${id}`})
        }
        
        const updateObject = {
            member_fee: body.member_fee,
            share_capital: body.share_capital,
            land_amount: body.land_amount,
            construction_fund: body.construction_fund,
            transfer_fee: body.transfer_fee,
            n_a_conversion_amount: body.n_a_conversion_amount,
            maintenance_amount: body.maintenance_amount,
            deposit: body.deposit,
            penalty: body.penalty
        }

        const updateReceiptData = await PaymentReceiptSchema.updateOne({_id: findData._id}, updateObject);

        if(updateReceiptData.modifiedCount === 0){
            return res.status(402).json({status:false,message:errorMessage.UPDATE_FAILED})
        }
        res.status(200).josn({status:true, message: successMessage.UPDATE_SUCCESS})
    }catch(error){
        console.log('Error while updating payment receipt detail: '.error);
        res.status(500).json({status:false, message:errorMessage.INTERNAL_SERVER_ERROR, error:error.message})
    }
}

module.exports = {addPaymentReceiptData, verifyPayment, getPaymentReceiptList, editPaymentReceiptDetail}