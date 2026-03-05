import { Router } from "express";
import successResponse from "../../utils/response/successResponse.js";
import { login, resendOTP, signup, signupWithGoogle, verifyOtp } from "./auth.service.js";

const authRouter = Router()

authRouter.post('/signup', async (req, res) => {
    await signup(req.body)
    return successResponse({ res, message: 'check your email for OTP verification', statusCode: 201 })
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

authRouter.post('/login', async (req, res) => {
    const result = await login(req.body)
    return successResponse({ res, data: result, message: 'logged in successfully', statusCode: 200 })
})

export default authRouter