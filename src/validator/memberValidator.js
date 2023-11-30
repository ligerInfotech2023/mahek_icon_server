const { celebrate, Segments, Joi } = require("celebrate");

const shopSizeRegex = /^\d+(\.\d+)?\s*[*x]\s*\d+(\.\d+)?$/
module.exports = {
    addNewMemberValidator: () => celebrate({
        [Segments.BODY]: Joi.object().keys({
            shop_number:Joi.string().required(), 
            owner_name_1 : Joi.string().required(),
            owner_name_2:Joi.string().allow(null, ""),
            email: Joi.string().email().trim(true).required(),
            contact_number_1: Joi.number().required(),
            contact_number_2: Joi.number().allow(null, ""),
            shop_size: Joi.string().regex(shopSizeRegex).required()
            .messages(
                {
                    'string.pattern.base':'Shop size must be in the format "25.26 * 26.20" or "25 * 10"', 
                    'any.required': 'Shop size is required'
                }
            ),
            member_fee: Joi.number(),
            pending_member_fee: Joi.number(),
            maintenance: Joi.number(),
            pending_maintenance: Joi.number(),
            transfer_fee: Joi.number(),
            pending_transfer_fee: Joi.number(),
            share_capital: Joi.number(),
            pending_share_capital: Joi.number(),
            land_amount: Joi.number(),
            pending_land_amount: Joi.number(),
            construction_fund: Joi.number(),
            pending_construction_fund: Joi.number(),
            n_a_conversion_amount: Joi.number(),
            pending_n_a_conversion_amount: Joi.number(),
            deposit: Joi.number(),
            pending_deposit: Joi.number(),
        })
    }),
    editExistingMemberValidator: () => celebrate({
        [Segments.BODY]: Joi.object().keys({
            shop_number: Joi.string(),
            owner_name_1: Joi.string().required(),
            owner_name_2: Joi.string(),
            email: Joi.string().email().trim(true).required(),
            contact_number_1: Joi.number().required(),
            contact_number_2: Joi.number().allow(null, ""),
            shop_size: Joi.string().regex(shopSizeRegex).required()
            .messages(
                {
                    'string.pattern.base':'Shop size must be in the format "25.26 * 26.20" or "25 * 10"', 
                    'any.required': 'Shop size is required'
                }
            ),
            member_fee: Joi.number(),
            pending_member_fee: Joi.number(),
            maintenance: Joi.number(),
            pending_maintenance: Joi.number(),
            transfer_fee: Joi.number(),
            pending_transfer_fee: Joi.number(),
            share_capital: Joi.number(),
            pending_share_capital: Joi.number(),
            land_amount: Joi.number(),
            pending_land_amount: Joi.number(),
            construction_fund: Joi.number(),
            pending_construction_fund: Joi.number(),
            n_a_conversion_amount: Joi.number(),
            pending_n_a_conversion_amount: Joi.number(),
            deposit: Joi.number(),
            pending_deposit: Joi.number(),
        })
    })
}