import Joi from "joi";

export const userValidity = Joi.object({
    // 1. Basic Auth Info
    username: Joi.string()
        .alphanum()
        .min(3)
        .max(30)
        .required()
        .messages({
            'string.empty': 'Username cannot be empty',
            'string.min': 'Username should have a minimum length of {#limit}',
        }),

    email: Joi.string()
        .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net', 'in', 'org'] } })
        .required()
        .messages({
            'string.email': 'Please enter a valid email address'
        }),

    joined: Joi.date()
        .optional(),

    password: Joi.string()
        .min(8) // Minimum 8 chars
        .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')) // Optional: Regex for complexity
        .optional(),

    bio: Joi.string()
        .max(250) // Limit bio length so they don't write a novel
        .allow('', null)
        .messages({
            'string.max': 'Bio should not exceed 250 characters'
        }),

    phoneNum: Joi.string()
        .pattern(/^[0-9]+$/)
        .length(10) // Assuming standard 10-digit number
        .allow('', null)
        .messages({
            'string.pattern.base': 'Phone number must contain only digits',
            'string.length': 'Phone number must be 10 digits long'
        }),

    // 3. System Fields
    role: Joi.string()
        .valid('camper', 'host', 'admin') // Only allow these specific values
        .default('camper'),

    image: Joi.object({
        url: Joi.string().allow('', null),
        imageId: Joi.string().allow('', null)
    }).optional()
});