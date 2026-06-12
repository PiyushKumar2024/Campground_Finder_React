/**
 * @file catchAsync.js
 * @description Helper utility to wrap asynchronous Express route handlers and middleware.
 * Automatically catches any rejected promises and forwards them to the global error handler
 * via the next() function, eliminating the need for repetitive try/catch blocks.
 * 
 * @param {Function} fn - The asynchronous Express middleware/route handler to wrap
 * @returns {Function} A new Express middleware function
 */
function wrap(fn) {
    return function(req, res, next) {
        fn(req, res, next).catch(next);
    }
}
export default wrap;