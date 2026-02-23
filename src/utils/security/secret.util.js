import { UserRoles } from "../enums/user.enum.js"

export function getSecretKey(role) {
    switch (role) {
        case UserRoles.user:
            return process.env.USER_SECRET_KEY || ''
        case UserRoles.admin:
            return process.env.ADMIN_SECRET_KEY || ''
        default:
            return ''
    }
}