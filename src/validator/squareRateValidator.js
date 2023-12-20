const { celebrate, Segments, Joi, } = require("celebrate");
const { SquareRateType } = require("../helper/enums");

module.exports = {
    addSquareRateValidator: () => celebrate({
        [Segments.BODY]: Joi.object().keys({
            // name: Joi.string(),  //name should be dynamic based on select_type value
            select_type: Joi.string().valid(SquareRateType.Member_Fee, SquareRateType.Maintenance_Amount, SquareRateType.Transfer_Fee, SquareRateType.Share_Capital, SquareRateType.Land_Amount_Fund, SquareRateType.Construction_Fund, SquareRateType.N_A_Conversion_amount, SquareRateType.Deposit).required(),
            sqft_rate: Joi.number().required(),
            effective_start_date:Joi.date().raw().required(),
            effective_end_date: Joi.date()
                .ruleset.greater(Joi.ref('effective_start_date'))
                .rule({message:'effective_end_date must be greater than effective_start_date'}).raw().required(),
            collection_start_date: Joi.when('select_type', {
                is: SquareRateType.Maintenance_Amount,
                then: Joi.date().required(),
                otherwise: Joi.valid(null).label(`'collection_start_date' is must be null, its only available when select_type is ${SquareRateType.Maintenance_Amount}`)
            }),
            collection_end_date: Joi.when('select_type', {
                    is: SquareRateType.Maintenance_Amount,
                    then: Joi.date()
                    .ruleset.greater(Joi.ref('collection_start_date'))
                    .rule({message:'collection_end_date must be greater than collection_start_date'}).required(),
                    otherwise: Joi.valid(null).label(`'collection_end_date' is must be null, its only available when select_type is ${SquareRateType.Maintenance_Amount}`)
            })

            // collection_start_date: Joi.date().required(),
            // collection_end_date: Joi.date().required(),
        })
    })
}