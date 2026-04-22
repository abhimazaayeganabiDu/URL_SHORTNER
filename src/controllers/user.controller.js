import { eq } from 'drizzle-orm';
import { createHmac, randomBytes } from 'node:crypto';
import { db } from '../db/index.js';
import { usersTable } from '../models/user.model.js';
import { AsyncHandler } from '../utils/api-async-handler.js';
import ApiError from '../utils/api-error-handler.js';
import { ApiResponse } from '../utils/api-response-handler.js';
import { signUpSchema, validateHandler } from '../validations/request.validation.js';

const signUp = AsyncHandler(async (req, res, next) => {

    if (!req.body || typeof req.body !== 'object') {
        return next(new ApiError(400, "Request body must be a valid JSON object"));
    }

    const validationResult = await signUpSchema.safeParseAsync(req.body)

    if (validationResult.error) {
        const messages = validateHandler(validationResult)
        return next(new ApiError(400, messages, validationResult.error))
    }

    const { firstName, lastName, email, password } = validationResult.data;

    const [existingUser] = await db.select({
        id: usersTable.id
    }).from(usersTable).where(eq(usersTable.email, email));

    if (existingUser) {
        return next(new ApiError(400, `User with email ${email} already exist!`))
    }
    const salt = randomBytes(256).toString('hex')
    const hashedPassword = createHmac('sha256', salt).update(password).digest('hex')

    const [user] = await db.insert(usersTable).values({
        firstName, lastName, email, passwordHash: hashedPassword, salt
    }).returning({ id: usersTable.id })

    if (!user) {
        return next(new ApiError(500, `User not created`))
    }

    return res.status(201).json(new ApiResponse(201, "User Created Sucessfully.", user));
})




export { signUp };
