import express from 'express'
import mongoose from 'mongoose';
import env from './src/config/env.js'
import routers from './src/modules/routers.js'
import { errorMiddleware } from './src/middlewares/error.middleware.js';

const app = express();
app.use(express.json());


app.get('/', (req, res) => {
    res.send("Hellow Express");
})

// Api Route
app.use('/api', routers);

// Error Handler
app.use(errorMiddleware);

// DB Connect
mongoose.connect(env.dbUri).then(
    () => {
        console.log("Mongodb Connected")
    }
);

export default app;
