class ApiError extends Error {
    constructor(statusCode, message = 'Internal Server Error', errors = [], stack = '') {
        super(message);
        this.statusCode = statusCode;
        this.message = message;
        this.errors = errors;
        this.sucess = false;
        
        if (stack) {
            this.stack = stack;
        } else {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}

export default ApiError;