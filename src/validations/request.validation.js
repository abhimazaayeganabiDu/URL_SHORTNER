import {z} from "zod";
import {validationResult} from 'express-validator'


const signUpSchema = z.object({
    firstName: z.string(),
    lastName: z.string(),
    email: z.string().email(),
    password: z.string().min(8)
})


const validateHandler = (validationResult) => {

    const messages = validationResult.error.issues.map(issue => 
        issue.path.length ? `${issue.path.join('.')}: ${issue.message}` : issue.message
    ).join(', ');

    return messages;
}


export {signUpSchema, validateHandler}