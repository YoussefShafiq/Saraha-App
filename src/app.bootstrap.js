import express from "express";
import { NODE_ENV, PORT } from "../configs/app.config.js";
import testDbConncection from "./DB/connection.js";
import authRouter from "./Modules/Auth/auth.controller.js";
import { globalErrorHandling } from "./utils/response/failResponse.js";
import userRouter from "./Modules/User/user.controller.js";



export default async function bootstrap() {
    const app = express();
    await testDbConncection()
    app.use(express.json())
    app.use('/auth', authRouter)
    app.use('/user', userRouter)
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