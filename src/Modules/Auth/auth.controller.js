import { Router } from "express";
import successResponse from "../../utils/response/successResponse.js";
import { login, resendOTP, signup, signupWithGoogle, verifyOtp } from "./auth.service.js";
import { validation } from "../../Middlewares/validation.middleware.js";
import { loginSchema, signupSchema } from "../../utils/validationSchemas/auth.schema.js";

const authRouter = Router()

authRouter.post('/signup', validation(signupSchema), async (req, res) => {
    const result = await signup(req.body)
    return successResponse({ res, data: result, message: 'check your email for OTP verification', statusCode: 201 })
})

authRouter.post('/signup/gmail', async (req, res) => {
    const { tokens, message, status } = await signupWithGoogle(req.body)
    return successResponse({ res, data: tokens, message, statusCode: status })
})

authRouter.post('/verify-otp', async (req, res) => {
    const result = await verifyOtp(req.body)
    return successResponse({ res, data: result, message: 'user verified successfully', statusCode: 200 })
})

authRouter.post('/resend-otp', async (req, res) => {
    await resendOTP(req.body)
    return successResponse({ res, message: 'OTP resent successfully', statusCode: 200 })
})

authRouter.post('/login', validation(loginSchema), async (req, res) => {
    const result = await login(req.body)
    return successResponse({ res, data: result, message: 'logged in successfully', statusCode: 200 })
})

export default authRouter