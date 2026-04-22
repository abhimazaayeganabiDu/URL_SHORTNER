import express from 'express';
import dotenv from 'dotenv'


dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000

app.use(express.json())


app.get('/', (req, res) => {
    return res.json({ status: 'Server is up and running...' });
});

import userRouter from './src/routers/user.router.js'
import {errorMiddleware} from './src/middlewares/error.middleware.js';

app.use('/user', userRouter)


app.use(errorMiddleware);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});


