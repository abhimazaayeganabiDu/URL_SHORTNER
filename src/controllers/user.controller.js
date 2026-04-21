import {AsyncHandler} from '../utils/api-async-handler.js'
import {db} from '../db/index.js'
import { usersTable } from '../models/user.model.js';
import { eq } from 'drizzle-orm';
import ApiError from '../utils/api-error-handler.js';
import { createHmac, randomBytes } from 'node:crypto';
import {ApiResponse} from '../utils/api-response-handler.js'

const signup = AsyncHandler((req, res) => {
    const {fristName, lastName, email, password} = req.body;

    const [existingUser] = await db.select({
        id: usersTable.id
    }).from(usersTable).where(eq(usersTable.email, email));

    if(existingUser) {
        return new ApiError(400, `User with email ${email} already exist!`)
    }
    const salt = randomBytes(256).toString('hex')
    const hashedPassword = createHmac('sha256', salt).update(password).digest('hex')
    
    const [user] = await db.insert(usersTable).values({
        fristName, lastName, email, password: hashedPassword, salt
    }).returning({id: usersTable.id})
    
    if(!user) {
        return new ApiError(500, `User not created`)
    }

    return res.status(201).json(new ApiResponse(201, "User Created Sucessfully.", user));
})