import {fileTypeFromFile} from 'file-type';

export const validateImages=(req,res,next)=>{
    console.log(req.body);
    next();
}

//In a standard JSON request, you can validate the data before doing anything else. 
// However, when handling file uploads with multipart/form-data (which is what your form sends), 
// Express cannot read req.body or req.files until the multer middleware runs.
