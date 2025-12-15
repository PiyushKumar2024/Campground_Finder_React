import joi from 'joi';
const validSchema=joi.object({
        body:joi.string().required().max(250),
        rating:joi.number().required().min(1).max(5)
    })
 
export default validSchema;