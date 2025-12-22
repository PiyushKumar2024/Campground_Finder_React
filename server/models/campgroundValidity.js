import joi from 'joi';
const validSchema=joi.object({
        name:joi.string().required().max(200),
        price:joi.number().required().min(0),
        location:joi.string().required().max(100),
        description:joi.string().required().max(400),
        image:joi.array().optional(),
        //Handling Single vs. Multiple Deletions: When sending deleteImages via FormData, 
        // if only one image is selected, multer parses it as a string. If multiple are selected, 
        // it parses it as an array. Your controller currently iterates over req.body.deleteImages directly, 
        // which will cause a crash or unexpected behavior if it's a string 
        // (it will iterate over the characters of the string).
        deleteImages: joi.alternatives().try(
            joi.array().items(joi.string()),
            joi.string()
        ).optional()
    })
 
export default validSchema;    