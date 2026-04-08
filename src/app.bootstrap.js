import express from "express";
import { NODE_ENV, PORT } from "../configs/app.config.js";
import testDbConncection from "./DB/connection.js";
import authRouter from "./Modules/Auth/auth.controller.js";
import { badRequestException, globalErrorHandling } from "./utils/response/failResponse.js";
import userRouter from "./Modules/User/user.controller.js";
import cors from "cors";
import path from "path"
import { testRedisConnection } from "./DB/redis.connection.js";
import messageRouter from "./Modules/Message/message.controller.js";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { del, get, incr, set } from "./DB/Repository/redis.repo.js";



export default async function bootstrap() {
    const app = express();
    await testDbConncection()
    await testRedisConnection()


    app.use(
        express.json(),
        cors(),
        helmet(),
        rateLimit({
            windowMs: 15 * 60 * 1000,
            max: 100,
            message: 'Too many requests, please try again later',
            // implement key generator to store the blocked ips in redis
            keyGenerator: (req) => {
                // generate the key based on ip adress and path
                return `${req.ip}-${req.path}`
            },
            handler: (req, res) => {
                badRequestException('Too many requests, please try again later')
            },
            // handle redis storing manully using redis repository
            store: {
                get: async (key) => {
                    return await get(key)
                },
                set: async (key, value, ttl) => {
                    return await set(key, value, ttl)
                },
                incr: async (key) => {
                    return await incr(key)
                },
                del: async (key) => {
                    return await del(key)
                }
            }
        })
    )
    app.use('/uploads', express.static(path.resolve('./uploads')))
    app.use('/auth', authRouter)
    app.use('/user', userRouter)
    app.use('/message', messageRouter)
    app.use(globalErrorHandling)

    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    })

    app.all('*d', (req, res) => {
        return res.status(400).json({
            success: false,
            message: 'invalid route or method'
        })
    })
}