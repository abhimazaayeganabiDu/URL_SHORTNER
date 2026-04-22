import { error, log } from "node:console";

const envMode = process.env.NODE_ENV || "Development";



const errorMiddleware = (err, req, res, next) => {

    err.message ||= "Something went wrong!";
    err.statusCode ||= 500;

    if (err.code === '23505') { // PostgreSQL unique violation
        const field = err.constraint || 'field';
        err.message = `Duplicate value for ${field} field!`;
        err.statusCode = 400;
    }

    if (err.code === '23502') { // Not null violation
        err.message = `Required field is missing!`;
        err.statusCode = 400;
    }

    const response = {
        success: false,
        message: err.message,
        ...(envMode === "Development" && { error: err }),
    };

    res.status(err.statusCode).json(response);
};



export { errorMiddleware };
