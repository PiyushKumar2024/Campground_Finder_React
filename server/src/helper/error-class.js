/**
 * @file error-class.js
 * @description Custom error class for handling application-specific errors with HTTP status codes.
 */
class appError extends Error {
    constructor(message,status){
        super(message)
        this.status=status
    }
}

export default appError;