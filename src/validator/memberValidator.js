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
            member_fee: Joi.number().allow(null, ""),
            pending_member_fee: Joi.number().allow(null, ""),
            maintenance: Joi.number().allow(null, ""),
            pending_maintenance: Joi.number().allow(null, ""),
            transfer_fee: Joi.number().allow(null, ""),
            pending_transfer_fee: Joi.number().allow(null, ""),
            share_capital: Joi.number().allow(null, ""),
            pending_share_capital: Joi.number().allow(null, ""),
            land_amount: Joi.number().allow(null, ""),
            pending_land_amount: Joi.number().allow(null, ""),
            construction_fund: Joi.number().allow(null, ""),
            pending_construction_fund: Joi.number().allow(null, ""),
            n_a_conversion_amount: Joi.number().allow(null, ""),
            pending_n_a_conversion_amount: Joi.number().allow(null, ""),
            deposit: Joi.number().allow(null, ""),
            pending_deposit: Joi.number().allow(null, ""),
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
            member_fee: Joi.number().allow(null, ""),
            pending_member_fee: Joi.number().allow(null, ""),
            maintenance: Joi.number().allow(null, ""),
            pending_maintenance: Joi.number().allow(null, ""),
            transfer_fee: Joi.number().allow(null, ""),
            pending_transfer_fee: Joi.number().allow(null, ""),
            share_capital: Joi.number().allow(null, ""),
            pending_share_capital: Joi.number().allow(null, ""),
            land_amount: Joi.number().allow(null, ""),
            pending_land_amount: Joi.number().allow(null, ""),
            construction_fund: Joi.number().allow(null, ""),
            pending_construction_fund: Joi.number().allow(null, ""),
            n_a_conversion_amount: Joi.number().allow(null, ""),
            pending_n_a_conversion_amount: Joi.number().allow(null, ""),
            deposit: Joi.number().allow(null, ""),
            pending_deposit: Joi.number().allow(null, ""),
        })
    })
}