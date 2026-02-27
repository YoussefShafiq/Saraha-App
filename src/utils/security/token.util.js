import jwt from "jsonwebtoken";
import { TokenTypes } from "../enums/security.enum.js";
import { getSignature } from "./secret.util.js";

export function createTokens(user, { refresh = false } = {}) {
    const { accessSignature, refreshSignature } = getSignature(user.role)

    let accessToken
    let refreshToken

    accessToken = jwt.sign(
        {
            type: TokenTypes.access
        },
        accessSignature,
        {
            expiresIn: '15m',
            audience: user.role,
            subject: user._id.toString()
        }
    )

    !refresh && (
        refreshToken = jwt.sign(
            {
                type: TokenTypes.refresh
            },
            refreshSignature,
            {
                expiresIn: '30d',
                audience: user.role,
                subject: user._id.toString()
            }
        )
    )

    return {
        accessToken,
        refreshToken
    }
}