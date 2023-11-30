const {Segments, Joi, celebrate} = require('celebrate');
const {Roles, Permission, Status} = require('../helper/enums');

module.exports = {
    registerValidator: () => celebrate({
        [Segments.BODY]: Joi.object().keys({
            first_name: Joi.string().alphanum().min(3).max(30).required(),
            last_name: Joi.string().alphanum().min(3).max(30).required(),
            email:Joi.string().email().trim(true).required(),
            contact_number: Joi.string().length(10).pattern(/^[0-9]+$/).message('Contact number nust be a 10-digits number').required(),
            password:Joi.string().min(4).required(),
            confirm_password:Joi.string().valid(Joi.ref('password')).required(),
            role:Joi.string().valid(Roles.ADMIN, Roles.SUPERADMIN, Roles.USER).default(Roles.USER),
            permission:Joi.string().valid(Permission.ALL, Permission.MANAGE_USER, Permission.READ_ONLY).default(Permission.READ_ONLY),
            status:Joi.string().valid(Status.ACTIVE, Status.INACTIVE, Status.DELETED).default(Status.ACTIVE),
            varified:Joi.boolean().default(false),
            registration_date:Joi.date().default(new Date())
        })
    }),

    loginValidator: () => celebrate({
        [Segments.BODY]: Joi.object().keys({
            input: Joi.string().required().custom((value,helpers) => {
                //Check if input is valid valid email or contact_number
                const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
                const isValidContact = /^[0-9]+$/.test(value)

                if(!isValidEmail && !isValidContact){
                    return helpers.error('any.invalid')
                }
                return value.toString();
            }).label('Email or Contact number is must be valid value in input field'),
            password: Joi.string().required().label('Password is required')
        })

    })

}


