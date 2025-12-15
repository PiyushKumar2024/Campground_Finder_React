import joi from 'joi';
const validSchema=joi.object({
        name:joi.string().required().max(200),
        price:joi.number().required().min(0),
        location:joi.string().required().max(100),
        description:joi.string().required().max(400)
    })
 
export default validSchema;    