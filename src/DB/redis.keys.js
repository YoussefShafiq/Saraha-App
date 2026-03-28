export function userFailLoginAttempts(email) {
    return `user:fail:login:attempts:${email}`
}

export function userLoginBlocked(email) {
    return `user:login:blocked:${email}`
}

export function userResetPasswordOtp(email) {
    return `user:reset:password:otp:${email}`
}