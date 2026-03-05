import userModel from "../../DB/Models/user.model.js"
import { encrypt, hash } from "../../utils/security/crypto.util.js";
import { badRequestException, conflictException, notFoundException } from "../../utils/response/failResponse.js"
import bcrypt from 'bcryptjs'
import jwt from "jsonwebtoken";
import { getSignature } from "../../utils/security/secret.util.js";
import { generateOTP } from "../../utils/security/genOtp.util.js";
import { sendEmail } from "../../utils/email/sendEmail.util.js";
import { findOne } from "../../DB/Repository/get.repo.js";
import { createTokens } from "../../utils/security/token.util.js";
import { OAuth2Client } from "google-auth-library";
import { WEB_CLIENT_ID } from "../../../configs/app.config.js";
import { providers } from "../../utils/enums/user.enum.js";

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

export async function verifyGoogleToken(idToken) {
    const client = new OAuth2Client();

    const ticket = await client.verifyIdToken({
        idToken: idToken,
        audience: WEB_CLIENT_ID,
    });

    return ticket.getPayload()
}

export async function signupWithGoogle(body) {
    const { idToken } = body
    const payload = await verifyGoogleToken(idToken)

    if (!payload.email_verified) {
        badRequestException('email not verified by google')
    }

    let user = await findOne(userModel, { email: payload.email })

    if (user) {
        if (user.provider != providers.google) {
            badRequestException('account already exist, login with your credentials')
        }
        const tokens = createTokens(user)
        return {
            tokens,
            message: 'logged in with google successfully',
            status: 200
        }
    }

    const newUser = await userModel.create({
        name: payload.name, email: payload.email, provider: providers.google, profilePicture: payload.picture
    })

    const tokens = createTokens(newUser)

    return {
        tokens,
        message: 'signed up with google successfully',
        status: 201
    }

}