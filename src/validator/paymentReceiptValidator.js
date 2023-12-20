const {celebrate, Joi, Segments, errors} = require('celebrate');
const { PaymentType } = require('../helper/enums');


const paymentTypeErrorMsg = (fieldName, paymentType) => {
    return `${fieldName} is not allowed when payment type is ${paymentType}`
}
module.exports = {
    addPaymentReceiptValidator: () => celebrate({
        [Segments.BODY]: Joi.object().keys({
            shop_number: Joi.string().required(),
            member_fee: Joi.number(),
            share_capital: Joi.number(),
            land_amount: Joi.number(),
            construction_fund: Joi.number(),
            transfer_fee: Joi.number(),
            n_a_conversion_amount: Joi.number(),
            maintenance_amount: Joi.number(),
            deposit: Joi.number(),
            penalty: Joi.number(),
            payment_type: Joi.string().valid(PaymentType.NEFT, PaymentType.UPI, PaymentType.CHEQUE, PaymentType.CASH),
            transaction_number: Joi.when('payment_type', {
                is: Joi.exist().valid(PaymentType.NEFT),
                then: Joi.string().invalid(null).required().label('transaction_number must be a valid transaction_number'),
                otherwise: Joi.valid(null).label(paymentTypeErrorMsg('transaction_number',[PaymentType.CHEQUE, PaymentType.UPI, PaymentType.CASH]))
            }),
            bank_name: Joi.when('payment_type', {
                is: PaymentType.CHEQUE,
                then: Joi.string().required(),
                otherwise: Joi.valid(null).label(paymentTypeErrorMsg('bank_name',[PaymentType.NEFT, PaymentType.UPI, PaymentType.CASH]))
            }),
            cheque_number: Joi.when('payment_type',{
                is: PaymentType.CHEQUE,
                then: Joi.string().invalid(null).required().label('cheque_number must be a valid cheque number'),
                otherwise: Joi.valid(null).label(paymentTypeErrorMsg('cheque_number',[PaymentType.NEFT, PaymentType.UPI, PaymentType.CASH]))
            }),
            account_number: Joi.when('payment_type', {
                is: PaymentType.CHEQUE,
                then: Joi.string().invalid(null).required().pattern(/^\d{9,18}$/).messages({
                    'string.pattern.base': 'account_number must be a 9-18 digit number',
                    'any.required': 'account_number is required'
                }),
                otherwise: Joi.valid(null).label(paymentTypeErrorMsg('account_number',[PaymentType.NEFT, PaymentType.UPI, PaymentType.CASH]))
            }),
            // cash_amount: Joi.when('payment_type', {
            //     is: PaymentType.CASH,
            //     then: Joi.number().invalid(null).required().label('cash_amount must be valid amount'),
            //     otherwise: Joi.valid(null).label(paymentTypeErrorMsg('cash_amount',[PaymentType.NEFT, PaymentType.UPI, PaymentType.CHEQUE]))
            // }),
            upi_id: Joi.when('payment_type', {
                is: PaymentType.UPI,
                then: Joi.string().invalid(null).required().label('upi_id must be a valid upi_id'),
                otherwise: Joi.valid(null).label(paymentTypeErrorMsg('upi_id',[PaymentType.NEFT, PaymentType.CHEQUE, PaymentType.CASH]))
            }),
            receiver_name: Joi.string().required()
        })
    }),

    editPaymentReceiptValidator: () => celebrate({
        [Segments.BODY]: Joi.object().keys({
            member_fee: Joi.number(),
            share_capital: Joi.number(),
            land_amount: Joi.number(),
            construction_fund: Joi.number(),
            transfer_fee: Joi.number(),
            n_a_conversion_amount: Joi.number(),
            maintenance_amount: Joi.number(),
            deposit: Joi.number(),
            penalty: Joi.number()
        })
    })
}