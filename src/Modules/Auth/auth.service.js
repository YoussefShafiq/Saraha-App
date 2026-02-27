import userModel from "../../DB/Models/user.model.js"
import { encrypt, hash } from "../../utils/security/crypto.util.js";
import { badRequestException, conflictException, notFoundException } from "../../utils/response/failResponse.js"
import bcrypt from 'bcryptjs'
import jwt from "jsonwebtoken";
import { getSignature } from "../../utils/security/secret.util.js";
import { generateOTP } from "../../utils/security/genOtp.util.js";
import { sendEmail } from "../../utils/email/sendEmail.util.js";
import { findOne } from "../../DB/Repository/get.repo.js";
import { TokenTypes } from "../../utils/enums/security.enum.js";
import { createTokens } from "../../utils/security/token.util.js";

export async function signup(body) {
    const { name, email, password, phone, DOB, role, gender } = body
    const exsistingUser = await findOne(userModel, { email }, '+password')

    if (exsistingUser) {
        conflictException('email already exists')
    }

    const hashedPassword = await hash(password)

    const otp = generateOTP()

    await sendEmail(email, otp)
    const newUser = await userModel.create({
        name, email, password: hashedPassword, phone, DOB, role, gender, otp, otpExpires: Date.now() + 5 * 60 * 1000
    })

    return newUser
}

export async function verifyOtp(body) {
    const { email, otp } = body

    const exsistingUser = await findOne(userModel, { email }, '+otp +otpExpires +isVerified')

    if (!exsistingUser) {
        notFoundException('email not found')
    }

    if (exsistingUser.otp != otp) {
        badRequestException('invalid OTP')
    }

    if (exsistingUser.otpExpires < Date.now()) {
        badRequestException('OTP expired')
    }

    exsistingUser.isVerified = true
    exsistingUser.otp = null
    exsistingUser.otpExpires = null

    await exsistingUser.save()
    return exsistingUser
}

export async function resendOTP(body) {
    const { email } = body

    const exsistingUser = await findOne(userModel, { email }, '+otp +otpExpires +isVerified')

    if (!exsistingUser) {
        notFoundException('email not found, please sign up first')
    }

    const otp = generateOTP()

    await sendEmail(email, otp)
    exsistingUser.otp = otp
    exsistingUser.otpExpires = Date.now() + 5 * 60 * 1000
    await exsistingUser.save()

    return exsistingUser
}

export async function login(body) {
    const { email, password } = body

    const user = await findOne(userModel, { email }, '+password +isVerified')
    if (!user) {
        notFoundException('invalid credentials')
    }

    if (!user.isVerified) {
        badRequestException('Please verify your email first')
    }

    const isPasswordValid = await bcrypt.compare(password, user.password)

    if (!isPasswordValid) {
        notFoundException('invalid credentials')
    }

    const tokens = createTokens(user)

    return tokens

}